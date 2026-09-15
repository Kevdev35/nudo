import type { NoteRepository } from "@ports/note-repository";
import type { ProjectRepository } from "@ports/project-repository";

export function createListNotesUseCase(noteRepo: NoteRepository, projectRepo: ProjectRepository) {
    return async (userId: string, projectId: string) => {
        const project = await projectRepo.findById(projectId);

        if (!project || project.user_id !== userId) {
            throw new Error('Proyecto no encontrado');
        }

        return noteRepo.listByProject(projectId);
    };
}
