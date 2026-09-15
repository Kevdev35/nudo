import { integer,  text,sqliteTable } from 'drizzle-orm/sqlite-core';
import { project } from './project'

export const markdowndoc = sqliteTable('markdowndoc', {
    id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
    project_id: text().notNull().references(() => project.id),
    title: text().notNull().default('Sin titulo'),
    current_content: text().notNull().default(''),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    deletedAt: integer("deleted_at", { mode: 'timestamp' }),
})