import type { KanbanCardRepository } from "@ports/kanban-card-repository";
import type { KanbanListRepository } from "@ports/kanban-list-repository";
import type { KanbanBoardRepository } from "@ports/kanban-board-repository";
import type { ProjectRepository } from "@ports/project-repository";
import { moveCardsUseCase } from "./move-cards";

export function moveCardUseCase(kbCard: KanbanCardRepository, kbList: KanbanListRepository, kbBoard: KanbanBoardRepository, projectRepo: ProjectRepository) {
    const moveCards = moveCardsUseCase(kbCard, kbList, kbBoard, projectRepo);

    return async (userId: string, cardId: string, targetListId: string, newOrder: number) => {
        const [card] = await moveCards(userId, [cardId], targetListId, newOrder);

        return card ?? null;
    };
}
