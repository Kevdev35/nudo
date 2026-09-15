import type { ClientRepository } from '@ports/client-repository';
import type { NewClient } from '@entities/client_entity';
import { client } from '@infrastructure/db/schema/client';
import type { LibSQLDatabase } from 'drizzle-orm/libsql'
import { eq, isNull, and } from 'drizzle-orm';

export function createClientRepository(db: LibSQLDatabase): ClientRepository {
    return {
        async create(data: NewClient) {
            const [newClient] = await db.insert(client).values(data).returning();
            return newClient
        },
        async findById(id) {
            const resultsId = await db.select().from(client).where(eq(client.id, id));
            return resultsId[0] ?? null;
        },
        async listByUser(userId) {
            const resultsUserId = await db.select().from(client).where(and(eq(client.user_id, userId), isNull(client.deletedAt)));
            return resultsUserId;
        },
        async update(id, data) {
            const [updateData] = await db.update(client).set(data).where(eq(client.id, id)).returning();
            return updateData;
        },
        async softDelete(id) {
            const [softDeleted] = await db.update(client).set({deletedAt: new Date()}).where(eq(client.id, id)).returning();
            return softDeleted
        },
    };
}