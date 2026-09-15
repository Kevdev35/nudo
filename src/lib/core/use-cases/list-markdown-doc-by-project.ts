import type { MarkdownDocRepository } from '@ports/markdown-repository'
import type { ProjectRepository } from '@ports/project-repository'

export function listMarkdownDocsByProject(mdRepo: MarkdownDocRepository, projectRepo: ProjectRepository) {
    return async (userId: string, projectId: string) => {
        const project = await projectRepo.findById(projectId)

        if (!project || project.user_id !== userId) {
            throw new Error('Proyecto no encontrado')
        }

        const listMdByProject = await mdRepo.listByProject(projectId)

        return listMdByProject
    }
}