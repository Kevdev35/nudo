import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { dev } from "$app/environment"
import { db } from '@infrastructure/db/connection';
import { createUserRepository } from '@infrastructure/db/repositories/user-repository';
import { createSessionRepository } from '@infrastructure/db/repositories/session-repository';
import { createAuthProvider } from '@infrastructure/auth/session-auth-provider';
import { createLoginUseCase } from '@core/use-cases/login';

const userRepo = createUserRepository(db);
const sessionRepo = createSessionRepository(db);
const authProvider = createAuthProvider(sessionRepo);
const login = createLoginUseCase(userRepo, authProvider);

export const actions: Actions = {
  default: async ({ request, cookies}) => {
    
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    let session 

    try {
      session = await login(email, password);
    } catch (error) {
      return fail(400, { error: (error as Error).message });
    }

    cookies.set("session", session.token, {
        path: "/",
        httpOnly: true,
        secure: !dev,
        sameSite: "lax",
        expires: session.expiresAt

    })

    throw redirect(302, '/dashboard');
  }
};