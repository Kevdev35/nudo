import type { ClientRepository } from "@ports/client-repository";

export function listClientsUseCase(clientRepo: ClientRepository) {
    return async (userId: string) => {
        return clientRepo.listByUser(userId);
    };
}
