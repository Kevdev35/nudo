import type { KanbanBoardRepository } from '@ports/kanban-board-repository'
import type { ProjectRepository } from "@ports/project-repository";

export function createKanbanBoardUseCase(kbBoard: KanbanBoardRepository,projectRepo: ProjectRepository) {
    return async (userId: string, projectId: string, data: {name: string}) => {
        const project = await projectRepo.findById(projectId)

        if (!project || project.user_id !== userId) {
            throw new Error('Proyecto no encontrado');
        }

        const createNewKanbanBoard = await kbBoard.create({
            project_id: projectId,
            name: data.name
        })


        return createNewKanbanBoard
    }
}