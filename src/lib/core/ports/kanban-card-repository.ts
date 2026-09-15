import { type KanbanCard, type NewKanbanCard } from '@entities/kanban-card-entity';

export interface KanbanCardRepository {
    create(data: NewKanbanCard): Promise<KanbanCard>;
    findById(id: KanbanCard['id']): Promise<KanbanCard | null>;
    listByList(kanbanListId: KanbanCard['kanban_list_id']): Promise<KanbanCard[]>;
    update(id: KanbanCard['id'], data: Partial<Pick<NewKanbanCard, 'title' | 'description' | 'order' | 'kanban_list_id' | 'completed'>>): Promise<KanbanCard>;
    softDelete(id: KanbanCard['id']): Promise<KanbanCard>;
}
