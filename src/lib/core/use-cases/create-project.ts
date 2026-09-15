import type { ClientRepository } from "@ports/client-repository";
import type { ProjectRepository } from "@ports/project-repository";

export function createProjectUseCase(projectRepo: ProjectRepository, clientRepo: ClientRepository) {
    return async (userId: string, data: {name: string; description: string | null; clientId?: string | null; budget: number | null;}) => {
        if (data.clientId) {
            const client = await clientRepo.findById(data.clientId);
            if (!client || client.user_id !== userId) {
                throw new Error('Cliente no encontrado')
            } 
        }

        const createProject = await projectRepo.create({
            user_id: userId,
            client_id: data.clientId ?? null,
            name: data.name,
            description: data.description,
            status: 'pendiente',
            budget: data.budget
        })

        return createProject;
    }
}