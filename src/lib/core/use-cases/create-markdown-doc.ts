import type { MarkdownDocRepository } from "@ports/markdown-repository";
import type { ProjectRepository } from "@ports/project-repository";

export function createMarkdownDocUseCase(mdRepo: MarkdownDocRepository, projectRepo: ProjectRepository) {
    return async (userId: string, projectId: string, data: {title: string; }) => {
        const project = await projectRepo.findById(projectId);

        if (!project || project.user_id !== userId) {
            throw new Error('Proyecto no encontrado')
        }

        const newMarkdownDoc = await mdRepo.create({
            project_id: projectId,
            current_content: '',
            title: data.title ?? 'sin titulo'
        })

        return newMarkdownDoc
    }
}