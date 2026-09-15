import { note } from "@infrastructure/db/schema/note";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { eq, and, isNull } from 'drizzle-orm';
import type { NoteRepository } from "@ports/note-repository";
import type { NewNote } from "@entities/note-entity";

export function createNoteRepository(db: LibSQLDatabase): NoteRepository {
    return {
        async create(data: NewNote) {
            const [newNote] = await db.insert(note).values(data).returning()
            return newNote 
        },
        async findById(id) {
            const resultsId = await db.select().from(note).where(eq(note.id, id))
            return resultsId[0] ?? null
        },
        async listByProject(projectId) {
            const resultsProjectId = await db.select().from(note).where(and(eq(note.project_id, projectId), isNull(note.deletedAt)))
            return resultsProjectId 
        },
        async update(id, data) {
            const [updateNote] = await db.update(note).set(data).where(eq(note.id, id)).returning()
            return updateNote
        },
        async softDelete(id) {
            const [softDeleted] = await db.update(note).set({deletedAt: new Date()}).where(eq(note.id, id)).returning();
            return softDeleted
        },
    }
}