import { type KanbanBoard, type NewKanbanBoard } from '@entities/kanban-board-entity';

export interface KanbanBoardRepository {
    create(data: NewKanbanBoard): Promise<KanbanBoard>;
    findById(id: KanbanBoard['id']): Promise<KanbanBoard | null>;
    listByProject(projectId: KanbanBoard['project_id']): Promise<KanbanBoard[]>;
    update(id: KanbanBoard['id'], data: Partial<Pick<NewKanbanBoard, 'name'>>): Promise<KanbanBoard>;
    softDelete(id: KanbanBoard['id']): Promise<KanbanBoard>;
}
