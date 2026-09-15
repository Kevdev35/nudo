import type { LayoutServerLoad } from './$types';
import { redirect, error } from '@sveltejs/kit';
import { db } from '@infrastructure/db/connection';
import { createProjectRepository } from '@infrastructure/db/repositories/project-repository';
import { getProjectDetail } from '@core/use-cases/get-project-detail';
import { createClientRepository } from '@infrastructure/db/repositories/client-repository';

const projectRepo = createProjectRepository(db);
const clientRepo = createClientRepository(db)
const getProjectDetails = getProjectDetail(projectRepo);

export const load: LayoutServerLoad = async ({ locals, params }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    try {
        const project = await getProjectDetails(locals.user.id, params.id);
        const client = project.client_id ? await clientRepo.findById(project.client_id) : null;
        return { project, client };
    } catch (err) {
        throw error(404, 'Proyecto no encontrado');
    }
};
