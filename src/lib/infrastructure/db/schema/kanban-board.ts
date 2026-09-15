import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { project } from "./project";

export const kanbanboard = sqliteTable('kanbanboard',{
    id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
    project_id: text().notNull().references(() => project.id),
    name: text().notNull(),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    deletedAt: integer("deleted_at", { mode: 'timestamp' }),
})