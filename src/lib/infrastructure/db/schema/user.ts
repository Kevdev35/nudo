import { integer,  text, sqliteTable } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
    id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text(),
    email:  text().notNull().unique(),
    password_hash: text().notNull(),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    deletedAt: integer("deleted_at", { mode: 'timestamp' }),
});