import { hash, verify } from '@node-rs/argon2';
import type { AuthProvider } from '@ports/auth-provider';

import type { SessionRepository } from '@ports/session-repository';

import { randomBytes } from 'crypto';
import { createHash } from 'crypto';

export function createAuthProvider(sessionRepo: SessionRepository): AuthProvider {
    return {
        async hashPassword(password) {
            return hash(password, {
                memoryCost: 19456,
	            timeCost: 2,
	            parallelism: 1,
	            outputLen: 32
            })
        },
        async verifyPassword(password, hashedPassword) {
            return await verify(hashedPassword, password)
        },
        async createSession(userId) {
            const token = randomBytes(20).toString('hex');
            const sessionId = createHash('sha256').update(token).digest('hex');
            const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

            await sessionRepo.create({id: sessionId, user_id: userId, expiresAt: expiresAt});

            return { token, expiresAt };
        },
        async validateSession(token) {
            const sessionId = createHash('sha256').update(token).digest('hex');
            const session = await sessionRepo.findById(sessionId);

            if(!session) {
                return null;
            }

            if(session.expiresAt < new Date()) {
                return null;
            }

            return { userId: session.user_id }
        },
        async invalidateSession(token) {
            const sessionId = createHash('sha256').update(token).digest('hex');

            await sessionRepo.delete(sessionId)
        },
    };
}