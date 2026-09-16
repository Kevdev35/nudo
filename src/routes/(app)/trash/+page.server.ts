import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { db } from '@infrastructure/db/connection';
import { createProjectRepository } from '@infrastructure/db/repositories/project-repository';

const projectRepo = createProjectRepository(db);

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    const deletedProjects = await projectRepo.listDeleted(locals.user.id);

    return {
        deletedProjects,
    };
};

export const actions: Actions = {
    restore: async ({ request, locals }) => {
        if (!locals.user) throw redirect(302, '/login');

        const formData = await request.formData();
        const projectId = formData.get('projectId') as string;

        if (!projectId) {
            return fail(400, { error: 'ID de proyecto requerido' });
        }

        try {
            await projectRepo.restore(projectId);
        } catch (err) {
            return fail(400, { error: (err as Error).message });
        }

        return { success: true };
    },

    permanentDelete: async ({ request, locals }) => {
        if (!locals.user) throw redirect(302, '/login');

        const formData = await request.formData();
        const projectId = formData.get('projectId') as string;

        if (!projectId) {
            return fail(400, { error: 'ID de proyecto requerido' });
        }

        try {
            // For permanent delete, we'd need to actually delete from DB
            // For now, keep it soft-deleted (could add permanentDelete method later)
            return fail(400, { error: 'Eliminación permanente no disponible aún' });
        } catch (err) {
            return fail(400, { error: (err as Error).message });
        }
    },
};
