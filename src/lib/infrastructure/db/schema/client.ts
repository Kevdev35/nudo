import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";

export const client = sqliteTable('client', {
    id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
    user_id: text().notNull(),
    name: text().notNull(),
    contact_info: text(),
    notes: text(),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    deletedAt: integer("deleted_at", { mode: 'timestamp' }),
});