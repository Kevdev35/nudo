import { type Project, type NewProject } from "@entities/project-entity";

export interface ProjectRepository{
    create(data: NewProject): Promise<Project>;
    findById(id: Project['id']): Promise<Project | null>;
    listByUser(userId: Project['user_id']): Promise<Project[]>;
    listByClient(clientId: string): Promise<Project[]>;
    update(id: Project['id'], data: Partial<Pick<NewProject, 'name' | 'description' | 'status' | 'budget'>>): Promise<Project>;
    softDelete(id: Project['id']): Promise<Project>;
}