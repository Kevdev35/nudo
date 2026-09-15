import type { MarkdownDocRepository } from '@ports/markdown-repository'
import type { ProjectRepository } from '@ports/project-repository'

export function getMarkdownUseCase(mdRepo: MarkdownDocRepository, projectRepo: ProjectRepository) {
    return async (userId: string, markdownDocId: string) => {
        const markdown = await mdRepo.findById(markdownDocId)

        if (!markdown) {
            throw new Error ('Documento no encontrado')
        }

        const project = await projectRepo.findById(markdown.project_id)

        if (!project || project.user_id !== userId){
            throw new Error('Documento no encontrado')
        }

        return markdown
    }
}