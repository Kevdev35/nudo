import type { KanbanCardRepository } from "@ports/kanban-card-repository";
import type { KanbanListRepository } from "@ports/kanban-list-repository";
import type { KanbanBoardRepository } from "@ports/kanban-board-repository";
import type { ProjectRepository } from "@ports/project-repository";

export function moveCardUseCase(kbCard: KanbanCardRepository, kbList: KanbanListRepository, kbBoard: KanbanBoardRepository, projectRepo: ProjectRepository) {
    return async (userId: string, cardId: string, targetListId: string, newOrder: number) => {
        const card = await kbCard.findById(cardId);

        if (!card) {
            throw new Error('Tarjeta no encontrada');
        }

        const sourceList = await kbList.findById(card.kanban_list_id);

        if (!sourceList) {
            throw new Error('Tarjeta no encontrada');
        }

        const board = await kbBoard.findById(sourceList.kanban_board_id);

        if (!board) {
            throw new Error('Tarjeta no encontrada');
        }

        const project = await projectRepo.findById(board.project_id);

        if (!project || project.user_id !== userId) {
            throw new Error('Tarjeta no encontrada');
        }

        const targetList = await kbList.findById(targetListId);

        if (!targetList) {
            throw new Error('Lista destino no encontrada');
        }

        if (targetList.kanban_board_id !== board.id) {
            throw new Error('La lista destino no pertenece al mismo tablero');
        }

        // `newOrder` es la posición (0-based) dentro de la lista destino, sin contar
        // la tarjeta movida. Se renumera la lista completa para evitar huecos
        // y que el orden quede estable al recargar.
        const targetCards = (await kbCard.listByList(targetListId))
            .filter((c) => c.id !== cardId)
            .sort((a, b) => a.order - b.order);

        const index = Number.isFinite(newOrder)
            ? Math.min(Math.max(Math.trunc(newOrder), 0), targetCards.length)
            : targetCards.length;

        const reordered = [...targetCards.slice(0, index), card, ...targetCards.slice(index)];

        await Promise.all(reordered.map((c, i) =>
            kbCard.update(c.id, {
                order: i + 1,
                ...(c.id === cardId ? { kanban_list_id: targetListId } : {}),
            })
        ));

        if (card.kanban_list_id !== targetListId) {
            const sourceCards = (await kbCard.listByList(card.kanban_list_id))
                .filter((c) => c.id !== cardId)
                .sort((a, b) => a.order - b.order);

            await Promise.all(sourceCards.map((c, i) => kbCard.update(c.id, { order: i + 1 })));
        }

        return kbCard.findById(cardId);
    };
}
