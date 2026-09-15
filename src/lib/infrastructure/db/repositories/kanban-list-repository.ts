import { kanbanlist } from "@infrastructure/db/schema/kanban-list";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { eq, and, isNull } from 'drizzle-orm';
import type { KanbanListRepository } from "@ports/kanban-list-repository";
import type { NewKanbanList } from "@entities/kanban-list-entity";

export function createKanbanListRepository(db: LibSQLDatabase): KanbanListRepository {
    return {
        async create(data: NewKanbanList) {
            const [newList] = await db.insert(kanbanlist).values(data).returning();
            return newList;
        },
        async findById(id) {
            const results = await db.select().from(kanbanlist).where(eq(kanbanlist.id, id));
            return results[0] ?? null;
        },
        async listByBoard(kanbanBoardId) {
            const results = await db.select().from(kanbanlist).where(and(eq(kanbanlist.kanban_board_id, kanbanBoardId), isNull(kanbanlist.deletedAt)));
            return results;
        },
        async update(id, data) {
            const [updated] = await db.update(kanbanlist).set(data).where(eq(kanbanlist.id, id)).returning();
            return updated;
        },
        async softDelete(id) {
            const [deleted] = await db.update(kanbanlist).set({ deletedAt: new Date() }).where(eq(kanbanlist.id, id)).returning();
            return deleted;
        },
    };
}
