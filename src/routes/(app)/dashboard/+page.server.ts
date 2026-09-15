import type { PageServerLoad } from './$types';

import { redirect, fail, type Actions } from '@sveltejs/kit';

import { createListMyProject } from '@core/use-cases/list-my-project';
import { createClientRepository } from '@infrastructure/db/repositories/client-repository';
import { createProjectRepository } from '@infrastructure/db/repositories/project-repository';
import { db } from '@infrastructure/db/connection';
import { createProjectUseCase } from '@core/use-cases/create-project';
import { createLogoutUseCase } from '@core/use-cases/logout';
import { createSessionRepository } from '@infrastructure/db/repositories/session-repository';
import { createAuthProvider } from '@infrastructure/auth/session-auth-provider';
import { listClientsUseCase } from "@core/use-cases/list-clients";

const projectRepo = createProjectRepository(db)
const listMyProjects = createListMyProject(projectRepo)

const clientRepo = createClientRepository(db)
const createProject = createProjectUseCase(projectRepo, clientRepo)

const sessionRepo = createSessionRepository(db);
const authProvider = createAuthProvider(sessionRepo);
const logout = createLogoutUseCase(authProvider);

const listClients = listClientsUseCase(clientRepo);

export const load: PageServerLoad = async({locals}) => {
    if (!locals.user) {
        throw redirect(302, "/login")
    }

    const projects = await listMyProjects(locals.user.id)

    const clients = await listClients(locals.user.id)

    return { projects, user: locals.user, clients }
}

export const actions: Actions = {
    createProject: async ({request, locals}) => {

        if (!locals.user) { 
            throw redirect(302, "/login")
        }

        const formData = await request.formData()
        const name = formData.get("name") as string
        const description = formData.get("description") as string || null
        const clientId = (formData.get("clientId") as string ) || null
        const budgetRaw = formData.get('budget') as string;
        const budget = budgetRaw ? Number(budgetRaw) : null;

        let newProject

        try {
            newProject = await createProject(locals.user.id, {name, description, clientId, budget});
        } catch (error) {
            return fail(400, { error: (error as Error).message });
        }

        throw redirect(302, `/projects/${newProject.id}`)
    },

    logout: async ({cookies, locals}) => {
        if (!locals.user) throw redirect(302, "/login")

        const token = cookies.get("session")

        if (token) {
            await logout(token)
        }
        cookies.delete("session", {path: "/"})

        throw redirect(302, "/login")
    }
} 
