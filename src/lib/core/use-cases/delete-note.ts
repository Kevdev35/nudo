import type { NoteRepository } from "@ports/note-repository";
import type { ProjectRepository } from "@ports/project-repository";

export function createDeleteNoteUseCase(noteRepo: NoteRepository, projectRepo: ProjectRepository) {
    return async (userId: string, noteId: string) => {
        const note = await noteRepo.findById(noteId);

        if (!note) {
            throw new Error('Nota no encontrada');
        }

        const project = await projectRepo.findById(note.project_id);

        if (!project || project.user_id !== userId) {
            throw new Error('Nota no encontrada');
        }

        const deletedNote = await noteRepo.softDelete(noteId);

        return deletedNote;
    };
}
