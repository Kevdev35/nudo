import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { kanbanboard } from "./kanban-board";

export const kanbanlist = sqliteTable('kanbanlist',{
    id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
    kanban_board_id: text().notNull().references(() => kanbanboard.id),
    name: text().notNull(),
    order: integer().notNull(),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    deletedAt: integer("deleted_at", { mode: 'timestamp' }),
})