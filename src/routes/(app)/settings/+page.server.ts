import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { db } from '@infrastructure/db/connection';
import { createUserRepository } from '@infrastructure/db/repositories/user-repository';
import { createSessionRepository } from '@infrastructure/db/repositories/session-repository';
import { createAuthProvider } from '@infrastructure/auth/session-auth-provider';
import argon2 from '@node-rs/argon2';

const userRepo = createUserRepository(db);
const sessionRepo = createSessionRepository(db);
const authProvider = createAuthProvider(sessionRepo);

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    return {
        user: locals.user,
    };
};

export const actions: Actions = {
    updateProfile: async ({ request, locals }) => {
        if (!locals.user) throw redirect(302, '/login');

        const formData = await request.formData();
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;

        if (!name || name.trim().length === 0) {
            return fail(400, { error: 'El nombre es obligatorio' });
        }

        if (!email || email.trim().length === 0) {
            return fail(400, { error: 'El email es obligatorio' });
        }

        if (email !== locals.user.email) {
            const existing = await userRepo.findByEmail(email);
            if (existing) {
                return fail(400, { error: 'Este email ya está en uso' });
            }
        }

        try {
            await userRepo.update(locals.user.id, {
                name: name.trim(),
                email: email.trim(),
            });
        } catch (err) {
            return fail(400, { error: (err as Error).message });
        }

        return { success: true, message: 'Perfil actualizado' };
    },

    changePassword: async ({ request, locals }) => {
        if (!locals.user) throw redirect(302, '/login');

        const formData = await request.formData();
        const currentPassword = formData.get('currentPassword') as string;
        const newPassword = formData.get('newPassword') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return fail(400, { error: 'Todos los campos son obligatorios' });
        }

        if (newPassword.length < 6) {
            return fail(400, { error: 'La nueva contraseña debe tener al menos 6 caracteres' });
        }

        if (newPassword !== confirmPassword) {
            return fail(400, { error: 'Las contraseñas no coinciden' });
        }

        const user = await userRepo.findById(locals.user.id);
        if (!user) {
            return fail(400, { error: 'Usuario no encontrado' });
        }

        const valid = await argon2.verify(user.password_hash, currentPassword);
        if (!valid) {
            return fail(400, { error: 'La contraseña actual es incorrecta' });
        }

        try {
            const hash = await argon2.hash(newPassword, {
                memoryCost: 19456,
                timeCost: 2,
                parallelism: 1,
                outputLen: 32,
            });
            await userRepo.update(locals.user.id, { password_hash: hash });
        } catch (err) {
            return fail(400, { error: (err as Error).message });
        }

        return { success: true, message: 'Contraseña actualizada' };
    },
};
