import type { ProjectFileRepository } from "@ports/file-repository";
import type { ProjectRepository } from "@ports/project-repository";
import type { TypeFile } from "@entities/file-entity";

export function createFileUseCase(fileRepo: ProjectFileRepository, projectRepo: ProjectRepository) {
    return async (userId: string, projectId: string, data: { type: TypeFile; url_or_path: string; name: string }) => {
        const project = await projectRepo.findById(projectId)

        if (!project || project.user_id !== userId) {
            throw new Error('Proyecto no encontrado');
        }

        const createNewProjectFile = await fileRepo.create({
            project_id: projectId,
            type: data.type,
            url_or_path: data.url_or_path,
            name: data.name
        })


        return createNewProjectFile

    };
}
