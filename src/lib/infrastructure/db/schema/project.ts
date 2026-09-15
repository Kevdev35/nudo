import { integer,  text, real ,sqliteTable } from 'drizzle-orm/sqlite-core';
import { user } from './user'
import { client } from './client';

export const project = sqliteTable('project',{
    id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
    user_id: text().notNull().references(() => user.id),
    client_id: text().references(() => client.id),
    name: text().notNull(),
    description: text(),
    status: text('status', {enum:['activo', 'pendiente', 'terminado']}).notNull().default('pendiente'),
    budget: real(),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    deletedAt: integer("deleted_at", { mode: 'timestamp' }),
})