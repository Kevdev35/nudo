import { db } from "@infrastructure/db/connection";
import { redirect, error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { createClientRepository } from "@infrastructure/db/repositories/client-repository";
import { createProjectRepository } from "@infrastructure/db/repositories/project-repository";
import { getClientUseCase } from "@core/use-cases/get-client";
import { listProjectsByClientUseCase } from "@core/use-cases/list-projects-by-client";

const clientRepo = createClientRepository(db);
const projectRepo = createProjectRepository(db);

const getClient = getClientUseCase(clientRepo);
const listProjectsByClient = listProjectsByClientUseCase(projectRepo);

export const load: PageServerLoad = async ({ locals, params }) => {
    if (!locals.user) {
        throw redirect(302, "/login");
    }

    try {
        const client = await getClient(locals.user.id, params.id ?? "");
        const projects = await listProjectsByClient(locals.user.id, client.id);

        return { client, projects };
    } catch {
        throw error(404, "Cliente no encontrado");
    }
};
