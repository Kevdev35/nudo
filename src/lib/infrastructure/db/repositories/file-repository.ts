import type { ProjectFileRepository } from '@ports/file-repository';
import type { NewProjectFile } from '@entities/file-entity';
import { file } from '@infrastructure/db/schema/file';

import type { LibSQLDatabase } from 'drizzle-orm/libsql'
import { eq, isNull, and } from 'drizzle-orm';

export function createProjectFileRepository(db: LibSQLDatabase): ProjectFileRepository {
    return {
        async create(data: NewProjectFile) {
            const [newProjectFile] = await db.insert(file).values(data).returning()
            return newProjectFile
        },
        async findById(id) {
            const resultsId = await db.select().from(file).where(eq(file.id, id))
            return resultsId[0] ?? null
        },
        async listByProject(projectId) {
            const resultsProjectId = await db.select().from(file).where(and(eq(file.project_id, projectId), isNull(file.deletedAt)))
            return resultsProjectId 
        },
        async update(id, data) {
            const [updateFile] = await db.update(file).set(data).where(eq(file.id, id)).returning()
            return updateFile
        },
        async softDelete(id) {
            const [softDeleted] = await db.update(file).set({deletedAt: new Date()}).where(eq(file.id, id)).returning();
            return softDeleted
        },
    }
}