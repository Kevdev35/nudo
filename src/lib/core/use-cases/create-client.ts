import type { ClientRepository } from "@ports/client-repository";

export function createClientUseCase(clientRepo: ClientRepository) {
    return async (userId: string, data: { name: string; email?: string | null; phone?: string | null; location?: string | null; notes?: string | null }) => {
        const createNewClient = await clientRepo.create({
            user_id: userId,
            name: data.name,
            email: data.email ?? null,
            phone: data.phone ?? null,
            location: data.location ?? null,
            notes: data.notes ?? null
        });

        return createNewClient;
    };
}