import type { KanbanCard } from "@entities/kanban-card-entity";
import type { KanbanCardRepository } from "@ports/kanban-card-repository";
import type { KanbanListRepository } from "@ports/kanban-list-repository";
import type { KanbanBoardRepository } from "@ports/kanban-board-repository";
import type { ProjectRepository } from "@ports/project-repository";

/**
 * Mueve una o varias tarjetas a una lista (columna) en la posición indicada.
 * `cardIds` llega en el orden visual en que deben quedar las tarjetas movidas
 * y `newOrder` es la posición (0-based) dentro de la lista destino, sin contar
 * las tarjetas que se mueven. Se renumera la lista completa para evitar huecos
 * y que el orden quede estable al recargar.
 */
export function moveCardsUseCase(kbCard: KanbanCardRepository, kbList: KanbanListRepository, kbBoard: KanbanBoardRepository, projectRepo: ProjectRepository) {
    return async (userId: string, cardIds: string[], targetListId: string, newOrder: number) => {
        const movingIds = [...new Set(cardIds)].filter(Boolean);

        if (movingIds.length === 0) {
            throw new Error('No hay tarjetas para mover');
        }

        const targetList = await kbList.findById(targetListId);

        if (!targetList) {
            throw new Error('Lista destino no encontrada');
        }

        const board = await kbBoard.findById(targetList.kanban_board_id);

        if (!board) {
            throw new Error('Lista destino no encontrada');
        }

        const project = await projectRepo.findById(board.project_id);

        if (!project || project.user_id !== userId) {
            throw new Error('Lista destino no encontrada');
        }

        // Todas las tarjetas deben pertenecer al proyecto y estar en el mismo tablero.
        const moving: KanbanCard[] = [];
        for (const cardId of movingIds) {
            const card = await kbCard.findById(cardId);

            if (!card) {
                throw new Error('Tarjeta no encontrada');
            }

            const cardList = await kbList.findById(card.kanban_list_id);

            if (!cardList || cardList.kanban_board_id !== board.id) {
                throw new Error('Tarjeta no encontrada');
            }

            moving.push(card);
        }

        const movingSet = new Set(movingIds);
        const targetCards = (await kbCard.listByList(targetListId))
            .filter((c) => !movingSet.has(c.id))
            .sort((a, b) => a.order - b.order);

        const index = Number.isFinite(newOrder)
            ? Math.min(Math.max(Math.trunc(newOrder), 0), targetCards.length)
            : targetCards.length;

        const reordered = [...targetCards.slice(0, index), ...moving, ...targetCards.slice(index)];

        await Promise.all(reordered.map((c, i) =>
            kbCard.update(c.id, {
                order: i + 1,
                ...(movingSet.has(c.id) ? { kanban_list_id: targetListId } : {}),
            })
        ));

        // Renumerar las listas de origen que perdieron tarjetas.
        const sourceListIds = [...new Set(
            moving
                .map((c) => c.kanban_list_id)
                .filter((listId) => listId !== targetListId)
        )];

        for (const sourceListId of sourceListIds) {
            const sourceCards = (await kbCard.listByList(sourceListId))
                .filter((c) => !movingSet.has(c.id))
                .sort((a, b) => a.order - b.order);

            await Promise.all(sourceCards.map((c, i) => kbCard.update(c.id, { order: i + 1 })));
        }

        const updated = await Promise.all(movingIds.map((id) => kbCard.findById(id)));

        return updated.filter((c): c is KanbanCard => c !== null);
    };
}
