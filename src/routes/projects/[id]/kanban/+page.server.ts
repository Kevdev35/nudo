import { db } from "@infrastructure/db/connection";
import type { PageServerLoad } from "./$types";
import { redirect, fail, type Actions } from '@sveltejs/kit';

import { createKanbanBoardRepository } from "@infrastructure/db/repositories/kanban-board-repository";
import { createKanbanListRepository } from "@infrastructure/db/repositories/kanban-list-repository";
import { createKanbanCardRepository } from "@infrastructure/db/repositories/kanban-card-repository";
import { createProjectRepository } from "@infrastructure/db/repositories/project-repository";

import { listKanbanBoardsUseCase } from "@core/use-cases/list-kanban-boards-by-project";
import { createKanbanBoardUseCase } from "@core/use-cases/create-kanban-board";
import { createKanbanListUseCase } from "@core/use-cases/create-kanban-list";
import { createKanbanCardUseCase } from "@core/use-cases/create-kanban-card";
import { listKanbanListsUseCase } from "@core/use-cases/list-kanban-lists-by-board";
import { listKanbanCardsUseCase } from "@core/use-cases/list-kanban-cards-by-list";
import { moveCardUseCase } from "@core/use-cases/move-card";
import { updateKanbanCardUseCase } from "@core/use-cases/update-kanban-card";
import { deleteKanbanCardUseCase } from "@core/use-cases/delete-kanban-card";

const boardRepo = createKanbanBoardRepository(db);
const listRepo = createKanbanListRepository(db);
const cardRepo = createKanbanCardRepository(db);
const projectRepo = createProjectRepository(db);

const listBoards = listKanbanBoardsUseCase(boardRepo, projectRepo);
const createBoard = createKanbanBoardUseCase(boardRepo, projectRepo);
const createList = createKanbanListUseCase(listRepo, boardRepo, projectRepo);
const createCard = createKanbanCardUseCase(cardRepo, listRepo, boardRepo, projectRepo);
const listLists = listKanbanListsUseCase(listRepo, boardRepo, projectRepo);
const listCards = listKanbanCardsUseCase(cardRepo, listRepo, boardRepo, projectRepo);
const moveCard = moveCardUseCase(cardRepo, listRepo, boardRepo, projectRepo);
const updateCard = updateKanbanCardUseCase(cardRepo, listRepo, boardRepo, projectRepo);
const deleteCard = deleteKanbanCardUseCase(cardRepo, listRepo, boardRepo, projectRepo);

export const load: PageServerLoad = async ({ locals, params }) => {
    if (!locals.user) {
        throw redirect(302, "/login");
    }

    const projectId = params.id;
    if (!projectId) {
        throw redirect(302, "/dashboard");
    }

    const boards = await listBoards(locals.user.id, projectId);
    const board = boards[0] ?? null;

    if (!board) {
        return { board: null, lists: [], cardsByList: {} };
    }

    const lists = await listLists(locals.user.id, board.id);

    const cardsByList: Record<string, Awaited<ReturnType<typeof listCards>>> = {};
    for (const list of lists) {
        cardsByList[list.id] = await listCards(locals.user.id, list.id);
    }

    return { board, lists, cardsByList };
};

export const actions: Actions = {
    createBoard: async ({ locals, request, params }) => {
        if (!locals.user) {
            throw redirect(302, "/login");
        }

        const projectId = params.id;
        if (!projectId) {
            return fail(400, { error: 'Proyecto no encontrado' });
        }

        const formData = await request.formData();
        const name = formData.get("name") as string;

        try {
            await createBoard(locals.user.id, projectId, { name });
        } catch (err) {
            return fail(400, { error: (err as Error).message });
        }

        throw redirect(302, `/projects/${projectId}/kanban`);
    },

    createList: async ({ locals, request, params }) => {
        if (!locals.user) {
            throw redirect(302, "/login");
        }

        const projectId = params.id;
        if (!projectId) {
            return fail(400, { error: 'Proyecto no encontrado' });
        }

        const formData = await request.formData();
        const boardId = formData.get("boardId") as string;
        const name = formData.get("name") as string;

        const existingLists = await listLists(locals.user.id, boardId);
        const order = existingLists.length + 1;

        try {
            await createList(locals.user.id, boardId, { name, order });
        } catch (err) {
            return fail(400, { error: (err as Error).message });
        }

        throw redirect(302, `/projects/${projectId}/kanban`);
    },

    createCard: async ({ locals, request, params }) => {
        if (!locals.user) {
            throw redirect(302, "/login");
        }

        const projectId = params.id;
        if (!projectId) {
            return fail(400, { error: 'Proyecto no encontrado' });
        }

        const formData = await request.formData();
        const listId = formData.get("listId") as string;
        const title = formData.get("title") as string;
        const description = (formData.get("description") as string) || null;

        const existingCards = await listCards(locals.user.id, listId);
        const order = existingCards.length + 1;

        try {
            await createCard(locals.user.id, listId, { title, description, order });
        } catch (err) {
            return fail(400, { error: (err as Error).message });
        }

        throw redirect(302, `/projects/${projectId}/kanban`);
    },

    moveCard: async ({ locals, request }) => {
        if (!locals.user) {
            throw redirect(302, "/login");
        }

        const formData = await request.formData();
        const cardId = formData.get("cardId") as string;
        const targetListId = formData.get("targetListId") as string;
        const newOrder = Number(formData.get("newOrder"));

        try {
            await moveCard(locals.user.id, cardId, targetListId, newOrder);
        } catch (err) {
            return fail(400, { error: (err as Error).message });
        }

        return { success: true };
    },

    updateCard: async ({ locals, request, params }) => {
        if (!locals.user) {
            throw redirect(302, "/login");
        }

        const projectId = params.id;
        if (!projectId) {
            return fail(400, { error: 'Proyecto no encontrado' });
        }

        const formData = await request.formData();
        const cardId = formData.get("cardId") as string;
        const title = formData.get("title") as string;
        const description = (formData.get("description") as string) || null;

        try {
            await updateCard(locals.user.id, cardId, { title, description });
        } catch (err) {
            return fail(400, { error: (err as Error).message });
        }

        throw redirect(302, `/projects/${projectId}/kanban`);
    },

    deleteCard: async ({ locals, request, params }) => {
        if (!locals.user) {
            throw redirect(302, "/login");
        }

        const projectId = params.id;
        if (!projectId) {
            return fail(400, { error: 'Proyecto no encontrado' });
        }

        const formData = await request.formData();
        const cardId = formData.get("cardId") as string;

        try {
            await deleteCard(locals.user.id, cardId);
        } catch (err) {
            return fail(400, { error: (err as Error).message });
        }

        throw redirect(302, `/projects/${projectId}/kanban`);
    },

    toggleCardComplete: async ({ locals, request, params }) => {
        if (!locals.user) {
            throw redirect(302, "/login");
        }

        const projectId = params.id;
        if (!projectId) {
            return fail(400, { error: 'Proyecto no encontrado' });
        }

        const formData = await request.formData();
        const cardId = formData.get("cardId") as string;

        const card = await cardRepo.findById(cardId);
        if (!card) {
            return fail(400, { error: 'Tarjeta no encontrada' });
        }

        try {
            await updateCard(locals.user.id, cardId, { completed: card.completed ? 0 : 1 });
        } catch (err) {
            return fail(400, { error: (err as Error).message });
        }

        throw redirect(302, `/projects/${projectId}/kanban`);
    }
};
