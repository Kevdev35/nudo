export interface KanbanList {
    id: string,
    kanban_board_id: string,
    name: string,
    order: number,
    createdAt: Date,
    deletedAt: Date | null,
}

export type NewKanbanList = Omit<KanbanList, 'id' | 'createdAt' | 'deletedAt'>
