import { db } from "@infrastructure/db/connection";
import type { PageServerLoad } from "./$types";
import { redirect, fail, type Actions } from '@sveltejs/kit';
import type { ClientRepository } from "@core/ports/client-repository";
import { createClientUseCase } from "@use-cases/create-client"
import { listClientsUseCase } from "@core/use-cases/list-clients";

import { createClientRepository } from "@infrastructure/db/repositories/client-repository";

const clientRepo = createClientRepository(db)
const listClient = listClientsUseCase(clientRepo)
const createClient = createClientUseCase(clientRepo)

export const load: PageServerLoad = async({locals}) => {
    if (!locals.user) {
        throw redirect(302, "/login")
    }

    const clients = await listClient(locals.user.id)

    return { clients, user: locals.user }
}

export const actions: Actions = {
    createClient: async({request, locals}) => {
        if (!locals.user?.id) {
            throw redirect(302, "/login")
        }

        const formData = await request.formData()
        const name = formData.get("name") as string
        const contact_info = formData.get("contact_info") as string || null
        const notes = formData.get("notes") as string || null

        let newClient;

        try {
            newClient = await createClient(locals.user.id, {name, contact_info, notes})
        } catch (error) {
            return fail(400, { error: (error as Error).message });
        }

        throw redirect(302, "/clients")
        
    }
}