import { type Session, type NewSession } from '@entities/session-entity';

export interface SessionRepository {
    create(data: NewSession): Promise<Session>;
    findById(id: Session['id']): Promise<Session | null>;
    delete(id: Session['id']): Promise<void>
}