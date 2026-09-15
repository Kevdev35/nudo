import { kanbancard } from "@infrastructure/db/schema/kanban-card";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { eq, and, isNull } from 'drizzle-orm';
import type { KanbanCardRepository } from "@ports/kanban-card-repository";
import type { NewKanbanCard } from "@entities/kanban-card-entity";

export function createKanbanCardRepository(db: LibSQLDatabase): KanbanCardRepository {
    return {
        async create(data: NewKanbanCard) {
            const [newCard] = await db.insert(kanbancard).values(data).returning();
            return newCard;
        },
        async findById(id) {
            const results = await db.select().from(kanbancard).where(eq(kanbancard.id, id));
            return results[0] ?? null;
        },
        async listByList(kanbanListId) {
            const results = await db.select().from(kanbancard).where(and(eq(kanbancard.kanban_list_id, kanbanListId), isNull(kanbancard.deletedAt)));
            return results;
        },
        async update(id, data) {
            const [updated] = await db.update(kanbancard).set(data).where(eq(kanbancard.id, id)).returning();
            return updated;
        },
        async softDelete(id) {
            const [deleted] = await db.update(kanbancard).set({ deletedAt: new Date() }).where(eq(kanbancard.id, id)).returning();
            return deleted;
        },
    };
}
