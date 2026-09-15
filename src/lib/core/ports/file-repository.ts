import { type ProjectFile, type NewProjectFile } from "@entities/file-entity";

export interface ProjectFileRepository {
    create(data: NewProjectFile): Promise<ProjectFile>
    findById(id: ProjectFile['id']): Promise<ProjectFile | null>;
    listByProject(projectId: ProjectFile['project_id']): Promise<ProjectFile[]>;
    update(id: ProjectFile['id'], data: Partial<Pick<NewProjectFile, 'name' >>): Promise<ProjectFile>;
    softDelete(id: ProjectFile['id']): Promise<ProjectFile>
}