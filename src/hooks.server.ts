import type { Handle } from '@sveltejs/kit';
import { db } from "@infrastructure/db/connection";
import { createUserRepository } from '@infrastructure/db/repositories/user-repository';
import { createSessionRepository } from '@infrastructure/db/repositories/session-repository';
import { createAuthProvider } from '@infrastructure/auth/session-auth-provider';

const userRepo = createUserRepository(db);
const sessionRepo = createSessionRepository(db);
const authProvider = createAuthProvider(sessionRepo);

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get("session")

    if (!token) {
        event.locals.user = null
        return resolve(event)
    }

    const result = await authProvider.validateSession(token);

    if (result) {
      event.locals.user = await userRepo.findById(result.userId);
    } else {
      event.cookies.delete('session', { path: '/' });
      event.locals.user = null;
    }


  return resolve(event);
}