import type { MarkdownDocRepository } from "@ports/markdown-repository";
import type { MarkdownDocVersionRepository } from "@ports/markdown-version-repository";
import type { ProjectRepository } from "@ports/project-repository";

export function createUpdateMarkdownDocUseCase(mdRepo: MarkdownDocRepository, mdRepoVersion: MarkdownDocVersionRepository,projectRepo: ProjectRepository) {
    return async(userId: string, markdownDocId: string, newContent: string) => {
        const markdownDoc = await mdRepo.findById(markdownDocId)

        if (!markdownDoc) {
            throw new Error('Documento no encontrado')
        }

        const project = await projectRepo.findById(markdownDoc.project_id)

        if (!project || project.user_id !== userId) {
            throw new Error('Documento no encontrado')
        }

        const existingVersion = await mdRepoVersion.listByMarkdownDoc(markdownDocId)
        const nextVersionNumber = existingVersion.length + 1

        await mdRepoVersion.create({
            markdown_doc_id: markdownDocId,
            content: markdownDoc.current_content,
            version_number: nextVersionNumber
        })

        const updateMarkdown = await mdRepo.update(markdownDocId, {current_content: newContent})

        return updateMarkdown
    }
}