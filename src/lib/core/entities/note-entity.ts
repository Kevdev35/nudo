export interface Note{
    id:  string,
    project_id:  string,
    order: number,
    content: string,
    title: string | null,
    color: string | null,
    completed?: number,
    draft?: number,
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export type NewNote = Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>