import type { NewProject } from "@entities/project-entity";
import type { ProjectRepository } from "@ports/project-repository";

export function createDeleteProjectUseCase(projectRepo: ProjectRepository){
    return async (userId: string, projectId: string) => {
        const searchProject = await projectRepo.findById(projectId);

        if(!searchProject || searchProject.user_id !== userId) {
            throw new Error('Proyecto no encontrado')
        }

        const softDeleteProject = await projectRepo.softDelete(projectId);

        return softDeleteProject
    }
}