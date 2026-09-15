import type { ClientRepository } from "@ports/client-repository";

export function deleteClientUseCase(clientRepo: ClientRepository) {
    return async (userId: string, clientId: string) => {
        const client = await clientRepo.findById(clientId);

        if (!client || client.user_id !== userId) {
            throw new Error('Cliente no encontrado');
        }

        const deletedClient = await clientRepo.softDelete(clientId);

        return deletedClient;
    };
}
