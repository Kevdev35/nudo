export interface Note{
    id:  string,
    project_id:  string,
    order: number,
    content: string,
    color: string | null,
    completed?: number,
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export type NewNote = Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>