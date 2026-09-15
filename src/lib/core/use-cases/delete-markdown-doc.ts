import type { MarkdownDocRepository } from '@ports/markdown-repository'
import type { ProjectRepository } from '@ports/project-repository'

export function createDeleteMarkdownDocUseCase(mdRepo: MarkdownDocRepository, projectRepo: ProjectRepository) {
    return async(userId: string, markdownDocId: string) => {
        const searchMarkdown = await mdRepo.findById(markdownDocId)

        if (!searchMarkdown) {
            throw new Error('Documento no encontrado')
        }

        const searchProject = await projectRepo.findById(searchMarkdown.project_id)

        if (!searchProject || searchProject.user_id !== userId) {
            throw new Error('Documento no encontrado')
        }

        const softDeleteMarkdown = await mdRepo.softDelete(markdownDocId)

        return softDeleteMarkdown
    }
}