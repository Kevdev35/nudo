import type { ClientRepository } from "@ports/client-repository";

export function updateClientUseCase(clientRepo: ClientRepository) {
    return async (userId: string, clientId: string, data: { name?: string; email?: string | null; phone?: string | null; location?: string | null; notes?: string | null }) => {
        const client = await clientRepo.findById(clientId);

        if (!client || client.user_id !== userId) {
            throw new Error('Cliente no encontrado');
        }

        const updatedClient = await clientRepo.update(clientId, data);

        return updatedClient;
    };
}
