import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { project } from "./project";

export const file = sqliteTable('file',{
    id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
    project_id: text().notNull().references(() => project.id),
    type: text('type', {enum:['image', 'uml', 'figma_link', 'other']}).notNull(),
    url_or_path: text().notNull(),
    name: text().notNull(),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    deletedAt: integer("deleted_at", { mode: 'timestamp' }),

})

