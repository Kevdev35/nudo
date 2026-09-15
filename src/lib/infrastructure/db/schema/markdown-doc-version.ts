import { integer,  text,sqliteTable } from 'drizzle-orm/sqlite-core';
import { markdowndoc } from './markdown-doc';

export const markdowndocversion = sqliteTable('markdowndocversion',{
    id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
    markdown_doc_id: text().notNull().references(() => markdowndoc.id),
    content: text().notNull(),
    version_number: integer().notNull(),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})