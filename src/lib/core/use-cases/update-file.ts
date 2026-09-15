import type { ProjectFileRepository } from "@ports/file-repository";
import type { ProjectRepository } from "@ports/project-repository";

export function updateFileUseCase(fileRepo: ProjectFileRepository, projectRepo: ProjectRepository) {
    return async (userId: string, fileId: string, data: { name?: string }) => {
        const file = await fileRepo.findById(fileId);

        if (!file) {
            throw new Error('Archivo no encontrado');
        }

        const project = await projectRepo.findById(file.project_id);

        if (!project || project.user_id !== userId) {
            throw new Error('Archivo no encontrado');
        }

        const updatedFile = await fileRepo.update(fileId, data);

        return updatedFile;
    };
}
