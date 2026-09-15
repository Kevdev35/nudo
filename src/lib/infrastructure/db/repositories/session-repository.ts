import type { SessionRepository } from '@ports/session-repository';
import type { NewSession } from '@entities/session-entity';
import { session } from '@infrastructure/db/schema/session'; 
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import { eq, isNull, and } from 'drizzle-orm';


export function createSessionRepository(db: LibSQLDatabase): SessionRepository {
    return {
        async create(data: NewSession) {
            const [newSession] = await db.insert(session).values(data).returning();
            return newSession;
        },
        async findById(id) {
            const resultsId = await db.select().from(session).where(eq(session.id, id));
            return resultsId[0] ?? null;
        },
        async delete(id) {
           await db.delete(session).where(eq(session.id, id));
        },
    };
}