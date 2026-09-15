import type { KanbanBoardRepository } from "@ports/kanban-board-repository";
import type { ProjectRepository } from "@ports/project-repository";

export function getKanbanBoardUseCase(kbBoard: KanbanBoardRepository, projectRepo: ProjectRepository) {
    return async (userId: string, kanbanboardId: string) => {
        const kanbanboard = await kbBoard.findById(kanbanboardId);

        if (!kanbanboard) {
            throw new Error('Tablero no encontrado');
        }

        const project = await projectRepo.findById(kanbanboard.project_id);

        if (!project || project.user_id !== userId) {
            throw new Error('Tablero no encontrado');
        }

        return kanbanboard;
    };
}
