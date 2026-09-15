import type { KanbanBoardRepository } from "@ports/kanban-board-repository";
import type { ProjectRepository } from "@ports/project-repository";

export function updateKanbanBoardUseCase(kbBoard: KanbanBoardRepository, projectRepo: ProjectRepository) {
    return async (userId: string, kanbanBoardId: string, data: { name?: string }) => {
        const board = await kbBoard.findById(kanbanBoardId);

        if (!board) {
            throw new Error('Tablero no encontrado');
        }

        const project = await projectRepo.findById(board.project_id);

        if (!project || project.user_id !== userId) {
            throw new Error('Tablero no encontrado');
        }

        const updatedBoard = await kbBoard.update(kanbanBoardId, data);

        return updatedBoard;
    };
}
