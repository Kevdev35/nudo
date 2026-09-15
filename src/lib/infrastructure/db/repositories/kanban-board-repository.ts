import { kanbanboard } from "@infrastructure/db/schema/kanban-board";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { eq, and, isNull } from 'drizzle-orm';
import type { KanbanBoardRepository } from "@ports/kanban-board-repository";
import type { NewKanbanBoard } from "@entities/kanban-board-entity";

export function createKanbanBoardRepository(db: LibSQLDatabase): KanbanBoardRepository {
    return {
        async create(data: NewKanbanBoard) {
            const [newBoard] = await db.insert(kanbanboard).values(data).returning();
            return newBoard;
        },
        async findById(id) {
            const results = await db.select().from(kanbanboard).where(eq(kanbanboard.id, id));
            return results[0] ?? null;
        },
        async listByProject(projectId) {
            const results = await db.select().from(kanbanboard).where(and(eq(kanbanboard.project_id, projectId), isNull(kanbanboard.deletedAt)));
            return results;
        },
        async update(id, data) {
            const [updated] = await db.update(kanbanboard).set(data).where(eq(kanbanboard.id, id)).returning();
            return updated;
        },
        async softDelete(id) {
            const [deleted] = await db.update(kanbanboard).set({ deletedAt: new Date() }).where(eq(kanbanboard.id, id)).returning();
            return deleted;
        },
    };
}
