import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { kanbanlist } from "./kanban-list";

export const kanbancard = sqliteTable('kanbancard',{
    id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
    kanban_list_id: text().notNull().references(() => kanbanlist.id),
    title: text().notNull().default('Sin titulo'),
    description: text(),
    completed: integer().notNull().default(0),
    order: integer().notNull(),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    deletedAt: integer("deleted_at", { mode: 'timestamp' }),
})