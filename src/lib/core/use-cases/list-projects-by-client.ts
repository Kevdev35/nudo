import type { ProjectRepository } from "@ports/project-repository";

/**
 * Proyectos asociados a un cliente. Filtra por dueño además del client_id:
 * la ruta ya valida que el cliente sea del usuario, pero el repo no conoce
 * al usuario y así el use-case queda seguro por sí solo.
 */
export function listProjectsByClientUseCase(projectRepo: ProjectRepository) {
    return async (userId: string, clientId: string) => {
        const projects = await projectRepo.listByClient(clientId);
        return projects.filter((project) => project.user_id === userId);
    };
}
