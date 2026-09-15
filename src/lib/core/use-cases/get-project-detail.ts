import type { ProjectRepository } from "@ports/project-repository";

export function getProjectDetail(projectRepo: ProjectRepository) {
    return async (userId: string, projectId: string) => {

        const project = await projectRepo.findById(projectId)

        if (!project) {
            throw new Error('Proyecto no encontrado')
        }

        if (project.user_id !== userId){
            throw new Error('Proyecto no encontrado')
        }

        return project
    }
}