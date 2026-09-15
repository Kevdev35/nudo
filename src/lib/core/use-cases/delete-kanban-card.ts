import type { KanbanCardRepository } from "@ports/kanban-card-repository";
import type { KanbanListRepository } from "@ports/kanban-list-repository";
import type { KanbanBoardRepository } from "@ports/kanban-board-repository";
import type { ProjectRepository } from "@ports/project-repository";

export function deleteKanbanCardUseCase(kbCard: KanbanCardRepository, kbList: KanbanListRepository, kbBoard: KanbanBoardRepository, projectRepo: ProjectRepository) {
    return async (userId: string, kanbanCardId: string) => {
        const card = await kbCard.findById(kanbanCardId);

        if (!card) {
            throw new Error('Tarjeta no encontrada');
        }

        const list = await kbList.findById(card.kanban_list_id);

        if (!list) {
            throw new Error('Tarjeta no encontrada');
        }

        const board = await kbBoard.findById(list.kanban_board_id);

        if (!board) {
            throw new Error('Tarjeta no encontrada');
        }

        const project = await projectRepo.findById(board.project_id);

        if (!project || project.user_id !== userId) {
            throw new Error('Tarjeta no encontrada');
        }

        const deletedCard = await kbCard.softDelete(kanbanCardId);

        return deletedCard;
    };
}
