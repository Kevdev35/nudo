import type { KanbanBoardRepository } from "@ports/kanban-board-repository";
import type { ProjectRepository } from "@ports/project-repository";

export function listKanbanBoardsUseCase(kbBoard: KanbanBoardRepository, projectRepo: ProjectRepository) {
    return async (userId: string, projectId: string) => {
        const project = await projectRepo.findById(projectId);

        if (!project || project.user_id !== userId) {
            throw new Error('Proyecto no encontrado');
        }

        return kbBoard.listByProject(projectId);
    };
}
