import type { UserRepository } from '@ports/user-repository';
import type { NewUser } from '@entities/user-entity';
import { user } from '@infrastructure/db/schema/user'; 
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import { eq, isNull, and } from 'drizzle-orm';

export function createUserRepository(db: LibSQLDatabase): UserRepository {
    return {
        async create(data: NewUser) {
            const [newUser] = await db.insert(user).values(data).returning();
            return newUser;
        }, 
        async findById(id) {
            const resultsId = await db.select().from(user).where(eq(user.id, id));
            return resultsId[0] ?? null;
        },
        async findByEmail(email) {
            const resultsEmail = await db.select().from(user).where(and(eq(user.email, email), isNull(user.deletedAt)));
            return resultsEmail[0] ?? null;
        },
        async update(id, data) {
            const [updateData] = await db.update(user).set(data).where(eq(user.id, id)).returning();
            return updateData;
        },
        async softDelete(id) {
            const [softDeleted] = await db.update(user).set({deletedAt: new Date()}).where(eq(user.id, id)).returning();
            return softDeleted
        },
    };
}
