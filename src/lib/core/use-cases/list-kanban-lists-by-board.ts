import type { KanbanListRepository } from "@ports/kanban-list-repository";
import type { KanbanBoardRepository } from "@ports/kanban-board-repository";
import type { ProjectRepository } from "@ports/project-repository";

export function listKanbanListsUseCase(kbList: KanbanListRepository, kbBoard: KanbanBoardRepository, projectRepo: ProjectRepository) {
    return async (userId: string, kanbanBoardId: string) => {
        const board = await kbBoard.findById(kanbanBoardId);

        if (!board) {
            throw new Error('Tablero no encontrado');
        }

        const project = await projectRepo.findById(board.project_id);

        if (!project || project.user_id !== userId) {
            throw new Error('Tablero no encontrado');
        }

        return kbList.listByBoard(kanbanBoardId);
    };
}
