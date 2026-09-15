import { integer,  text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { user } from './user'

export const session = sqliteTable('session', {
    id: text().primaryKey(),
    user_id: text().notNull().references(() => user.id),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    expiresAt: integer("expires_at", { mode: 'timestamp' }).notNull(),
})