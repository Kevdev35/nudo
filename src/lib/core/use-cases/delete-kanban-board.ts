import type { KanbanBoardRepository } from "@ports/kanban-board-repository";
import type { ProjectRepository } from "@ports/project-repository";

export function deleteKanbanBoardUseCase(kbBoard: KanbanBoardRepository, projectRepo: ProjectRepository) {
    return async (userId: string, kanbanBoardId: string) => {
        const board = await kbBoard.findById(kanbanBoardId);

        if (!board) {
            throw new Error('Tablero no encontrado');
        }

        const project = await projectRepo.findById(board.project_id);

        if (!project || project.user_id !== userId) {
            throw new Error('Tablero no encontrado');
        }

        const deletedBoard = await kbBoard.softDelete(kanbanBoardId);

        return deletedBoard;
    };
}
