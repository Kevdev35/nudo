export type TypeFile = 'image' | 'uml' | 'figma_link' | 'other'

export interface ProjectFile {
    id: string,
    project_id: string,
    type: TypeFile,
    url_or_path: string,
    name: string,
    createdAt: Date,
    deletedAt: Date | null,

}

export type NewProjectFile = Omit<ProjectFile, 'id' | 'createdAt' | 'deletedAt'>