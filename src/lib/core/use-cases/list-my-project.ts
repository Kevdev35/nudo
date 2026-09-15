import type { ProjectRepository } from "@ports/project-repository";

export function createListMyProject(projectRepo: ProjectRepository) {
    return async (userId: string) => {
        return projectRepo.listByUser(userId)
    }
}