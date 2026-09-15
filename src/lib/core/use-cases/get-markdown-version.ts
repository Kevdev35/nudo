import type { MarkdownDocVersionRepository } from '@ports/markdown-version-repository'
import type { MarkdownDocRepository } from '@ports/markdown-repository'
import type { ProjectRepository } from '@ports/project-repository'

export function getMarkdownVersionUseCase(mdRepo: MarkdownDocRepository, mdVersionRepo: MarkdownDocVersionRepository, projectRepo: ProjectRepository) {
    return async (userId: string, markdownDocVersion: string) => {
        const version = await mdVersionRepo.findById(markdownDocVersion)

        if (!version) throw new Error('Version no encontrada')

        const markdown = await mdRepo.findById(version.markdown_doc_id)

        if (!markdown) throw new Error('Documento no encontrado') 

        const searchProject = await projectRepo.findById(markdown.project_id)

        if (!searchProject || searchProject.user_id !== userId) {
            throw new Error('Proyecto no encontrado')
        }

        return version
    }
}