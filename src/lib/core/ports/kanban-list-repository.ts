import { type KanbanList, type NewKanbanList } from '@entities/kanban-list-entity';

export interface KanbanListRepository {
    create(data: NewKanbanList): Promise<KanbanList>;
    findById(id: KanbanList['id']): Promise<KanbanList | null>;
    listByBoard(kanbanBoardId: KanbanList['kanban_board_id']): Promise<KanbanList[]>;
    update(id: KanbanList['id'], data: Partial<Pick<NewKanbanList, 'name' | 'order'>>): Promise<KanbanList>;
    softDelete(id: KanbanList['id']): Promise<KanbanList>;
}
