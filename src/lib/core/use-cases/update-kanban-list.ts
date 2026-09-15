import type { KanbanListRepository } from "@ports/kanban-list-repository";
import type { KanbanBoardRepository } from "@ports/kanban-board-repository";
import type { ProjectRepository } from "@ports/project-repository";

export function updateKanbanListUseCase(kbList: KanbanListRepository, kbBoard: KanbanBoardRepository, projectRepo: ProjectRepository) {
    return async (userId: string, kanbanListId: string, data: { name?: string; order?: number }) => {
        const list = await kbList.findById(kanbanListId);

        if (!list) {
            throw new Error('Lista no encontrada');
        }

        const board = await kbBoard.findById(list.kanban_board_id);

        if (!board) {
            throw new Error('Lista no encontrada');
        }

        const project = await projectRepo.findById(board.project_id);

        if (!project || project.user_id !== userId) {
            throw new Error('Lista no encontrada');
        }

        const updatedList = await kbList.update(kanbanListId, data);

        return updatedList;
    };
}
