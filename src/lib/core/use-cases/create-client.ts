import type { ClientRepository } from "@ports/client-repository";

export function createClientUseCase(clientRepo: ClientRepository) {
    return async (userId: string, data: { name: string; contact_info?: string | null; notes?: string | null }) => {
        const createNewClient = await clientRepo.create({
            user_id: userId,
            name: data.name,
            contact_info: data.contact_info ?? null,
            notes: data.notes ?? null
        });

        return createNewClient;
    };
}