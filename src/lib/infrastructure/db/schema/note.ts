import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { project } from "./project";

export const note = sqliteTable('note',{
    id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
    project_id: text().notNull().references(() => project.id),
    order: integer().notNull(),
    content: text().notNull(),
    color: text(),
    completed: integer().notNull().default(0),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    deletedAt: integer("deleted_at", { mode: 'timestamp' }),
})