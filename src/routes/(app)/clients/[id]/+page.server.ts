import { db } from "@infrastructure/db/connection";
import { redirect, error, fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { createClientRepository } from "@infrastructure/db/repositories/client-repository";
import { createProjectRepository } from "@infrastructure/db/repositories/project-repository";
import { getClientUseCase } from "@core/use-cases/get-client";
import { updateClientUseCase } from "@core/use-cases/update-client";
import { deleteClientUseCase } from "@core/use-cases/delete-client";
import { createProjectUseCase } from "@core/use-cases/create-project";
import { listProjectsByClientUseCase } from "@core/use-cases/list-projects-by-client";

const clientRepo = createClientRepository(db);
const projectRepo = createProjectRepository(db);

const getClient = getClientUseCase(clientRepo);
const updateClient = updateClientUseCase(clientRepo);
const deleteClient = deleteClientUseCase(clientRepo);
const createProject = createProjectUseCase(projectRepo, clientRepo);
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

export const actions: Actions = {
    updateClient: async ({ request, locals, params }) => {
        if (!locals.user) {
            throw redirect(302, "/login");
        }

        const formData = await request.formData();
        const name = ((formData.get("name") as string) ?? "").trim();
        const email = ((formData.get("email") as string) ?? "").trim() || null;
        const phone = ((formData.get("phone") as string) ?? "").trim() || null;
        const location = ((formData.get("location") as string) ?? "").trim() || null;
        const notes = ((formData.get("notes") as string) ?? "").trim() || null;

        if (!name) {
            return fail(400, { error: "El nombre es obligatorio." });
        }

        try {
            await updateClient(locals.user.id, params.id ?? "", { name, email, phone, location, notes });
            return { success: true };
        } catch (err) {
            return fail(400, { error: (err as Error).message });
        }
    },

    createProject: async ({ request, locals, params }) => {
        if (!locals.user) {
            throw redirect(302, "/login");
        }

        const formData = await request.formData();
        const name = ((formData.get("name") as string) ?? "").trim();
        const description = ((formData.get("description") as string) ?? "").trim() || null;
        const budgetRaw = formData.get("budget") as string;
        const budget = budgetRaw ? Number(budgetRaw) : null;

        if (!name) {
            return fail(400, { error: "El nombre del proyecto es obligatorio." });
        }

        if (budget !== null && (Number.isNaN(budget) || budget < 0)) {
            return fail(400, { error: "El presupuesto no es válido." });
        }

        let newProject;

        try {
            newProject = await createProject(locals.user.id, {
                name,
                description,
                clientId: params.id ?? null,
                budget,
            });
        } catch (err) {
            return fail(400, { error: (err as Error).message });
        }

        throw redirect(302, `/projects/${newProject.id}`);
    },

    deleteClient: async ({ locals, params }) => {
        if (!locals.user) {
            throw redirect(302, "/login");
        }

        const clientId = params.id ?? "";
        const projects = await listProjectsByClient(locals.user.id, clientId);

        if (projects.length > 0) {
            const names = projects.map((project) => project.name).join(", ");
            const plural = projects.length === 1 ? "proyecto" : "proyectos";
            return fail(400, {
                error: `Este cliente tiene ${projects.length} ${plural}: ${names}. Reasigná o eliminá sus proyectos antes de borrarlo.`,
            });
        }

        try {
            await deleteClient(locals.user.id, clientId);
        } catch (err) {
            return fail(400, { error: (err as Error).message });
        }

        throw redirect(302, "/clients");
    },
};

