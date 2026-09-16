import type { ProjectRepository } from "@ports/project-repository";
import type { NewProject } from "@entities/project-entity";
import { project } from "@infrastructure/db/schema/project";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { eq, isNull, isNotNull, and } from 'drizzle-orm';

export function createProjectRepository(db: LibSQLDatabase): ProjectRepository {
    return {
        async create(data: NewProject) {
            const [newProject] = await db.insert(project).values(data).returning();
            return newProject;
        },
        async findById(id) {
            const resultsId = await db.select().from(project).where(eq(project.id, id));
            return resultsId[0] ?? null;
        },
        async listByUser(userId) {
            const resultsUserId = await db.select().from(project).where(and(eq(project.user_id, userId), isNull(project.deletedAt)))
            return resultsUserId
        },
        async listByClient(clientId) {
            const resultsClient = await db.select().from(project).where(and(eq(project.client_id, clientId), isNull(project.deletedAt)))
            return resultsClient
        },
        async listDeleted(userId) {
            const results = await db.select().from(project).where(and(eq(project.user_id, userId), isNotNull(project.deletedAt)))
            return results
        },
        async update(id, data) {
            const [updateData] = await db.update(project).set(data).where(eq(project.id, id)).returning();
            return updateData;
        },
        async softDelete(id) {
            const [softDeleted] = await db.update(project).set({deletedAt: new Date()}).where(eq(project.id, id)).returning();
            return softDeleted
        },
        async restore(id) {
            const [restored] = await db.update(project).set({deletedAt: null}).where(eq(project.id, id)).returning();
            return restored
        }
    };
}