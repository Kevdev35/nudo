export type ProjectStatus = 'activo' | 'pendiente' | 'terminado';

export interface Project {
    id: string;
    user_id: string;
    client_id: string | null;
    name: string;
    description: string | null;
    status: ProjectStatus;
    budget: number | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export type NewProject = Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;