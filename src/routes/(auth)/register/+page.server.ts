import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '@infrastructure/db/connection';
import { createUserRepository } from '@infrastructure/db/repositories/user-repository';
import { createSessionRepository } from '@infrastructure/db/repositories/session-repository';
import { createAuthProvider } from '@infrastructure/auth/session-auth-provider';
import { createSignupUseCase } from '@core/use-cases/signup';

const userRepo = createUserRepository(db);
const sessionRepo = createSessionRepository(db);
const authProvider = createAuthProvider(sessionRepo);
const signup = createSignupUseCase(userRepo, authProvider);

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = (formData.get('name') as string) || null;

    try {
      await signup(email, password, name);
    } catch (error) {
      return fail(400, { error: (error as Error).message });
    }

    throw redirect(302, '/login');
  }
};