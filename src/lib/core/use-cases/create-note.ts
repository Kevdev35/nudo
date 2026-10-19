import type { NoteRepository } from "@ports/note-repository";
import type { ProjectRepository } from "@ports/project-repository";

export function createNoteUseCase(noteRepo: NoteRepository, projectRepo: ProjectRepository) {
    return async (userId: string, projectId: string, data: { content: string; order: number; title?: string | null; color?: string | null }) => {
        const project = await projectRepo.findById(projectId);

        if (!project || project.user_id !== userId) {
            throw new Error('Proyecto no encontrado');
        }

        const newNote = await noteRepo.create({
            project_id: projectId,
            content: data.content,
            order: data.order,
            title: data.title ?? null,
            color: data.color ?? null,
        });

        return newNote;
    };
}
