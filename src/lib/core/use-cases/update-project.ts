import type { ProjectRepository } from "@ports/project-repository";
import type { ProjectStatus } from "@entities/project-entity";

export function createUpdateProjectUseCase(projectRepo: ProjectRepository){
    return async (userId: string, projectId: string, data: { name?: string; description?: string | null; status?: ProjectStatus; budget?: number | null }) => {
        const searchProject = await projectRepo.findById(projectId);

        if (!searchProject) {
            throw new Error('Proyecto no encontrado')
        }

        if(searchProject.user_id !== userId) {
            throw new Error('Proyecto no encontrado')
        }

        const updateProject = await projectRepo.update(projectId, data);

        return updateProject
    }
}