import type { MarkdownDocVersionRepository } from '@ports/markdown-version-repository'
import type { MarkdownDocRepository } from '@ports/markdown-repository'
import type { ProjectRepository } from '@ports/project-repository'

export function listMarkdownVersions(mdVersionRepo: MarkdownDocVersionRepository, mdRepo: MarkdownDocRepository, projectRepo: ProjectRepository) {
    return async (userId: string, markdownDocId: string) => {

        const searchMarkdown = await mdRepo.findById(markdownDocId)

        if (!searchMarkdown) {
            throw new Error('Documento no encontrado')
        }

        const project = await projectRepo.findById(searchMarkdown.project_id)

        if (!project || project.user_id !== userId) {
            throw new Error('Documento no encontrado')
        }

        const version = await mdVersionRepo.listByMarkdownDoc(markdownDocId)

        return version
    }
}