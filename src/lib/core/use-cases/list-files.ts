import type { ProjectFileRepository } from "@ports/file-repository";
import type { ProjectRepository } from "@ports/project-repository";

export function listFilesUseCase(fileRepo: ProjectFileRepository, projectRepo: ProjectRepository) {
    return async (userId: string, projectId: string) => {
        const project = await projectRepo.findById(projectId);

        if (!project || project.user_id !== userId) {
            throw new Error('Proyecto no encontrado');
        }

        return fileRepo.listByProject(projectId);
    };
}
