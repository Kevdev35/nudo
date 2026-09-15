export interface KanbanCard {
    id: string,
    kanban_list_id: string,
    title: string,
    description: string | null,
    completed?: number,
    order: number,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
}

export type NewKanbanCard = Omit<KanbanCard, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
