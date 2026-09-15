export interface KanbanBoard {
    id: string,
    project_id: string,
    name: string,
    createdAt: Date,
    deletedAt: Date | null,
}

export type NewKanbanBoard = Omit<KanbanBoard, 'id' | 'createdAt' | 'deletedAt'>
