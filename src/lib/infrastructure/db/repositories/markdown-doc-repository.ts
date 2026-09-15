import { markdowndoc } from "@infrastructure/db/schema/markdown-doc";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { eq, and, isNull } from 'drizzle-orm';
import { type NewMarkdownDoc } from '@entities/markdown-doc-entity'
import type { MarkdownDocRepository } from "@ports/markdown-repository";

export function createMarkdownDocRepository(db: LibSQLDatabase): MarkdownDocRepository {
    return {
        async create(data: NewMarkdownDoc) {
            const [newMarkdownDoc] = await db.insert(markdowndoc).values(data).returning() 
            return newMarkdownDoc
        },
        async findById(id) {
            const resultsId = await db.select().from(markdowndoc).where(eq(markdowndoc.id, id))
            return resultsId[0] ?? null
        },
        async listByProject(projectId) {
            const resultsProjectId = await db.select().from(markdowndoc).where(and(eq(markdowndoc.project_id, projectId), isNull(markdowndoc.deletedAt)))
            return resultsProjectId 
        },
        async update(id, data) {
            const [updateMarkdowndoc] = await db.update(markdowndoc).set(data).where(eq(markdowndoc.id, id)).returning()
            return updateMarkdowndoc
        },
        async softDelete(id) {
            const [softDeleted] = await db.update(markdowndoc).set({deletedAt: new Date()}).where(eq(markdowndoc.id, id)).returning();
            return softDeleted
        }
    }
}