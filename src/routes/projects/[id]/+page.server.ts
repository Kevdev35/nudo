import type { PageServerLoad } from './$types';
import { redirect, error, fail, type Actions } from '@sveltejs/kit';
import { db } from '@infrastructure/db/connection';
import { createProjectRepository } from '@infrastructure/db/repositories/project-repository';
import { createNoteRepository } from '@infrastructure/db/repositories/notes-repository';
import { createKanbanBoardRepository } from '@infrastructure/db/repositories/kanban-board-repository';
import { createKanbanListRepository } from '@infrastructure/db/repositories/kanban-list-repository';
import { createKanbanCardRepository } from '@infrastructure/db/repositories/kanban-card-repository';
import { createMarkdownDocRepository } from '@infrastructure/db/repositories/markdown-doc-repository';
import { createProjectFileRepository } from '@infrastructure/db/repositories/file-repository';
import { createClientRepository } from '@infrastructure/db/repositories/client-repository';
import { getProjectDetail } from '@core/use-cases/get-project-detail';
import { createUpdateProjectUseCase } from '@use-cases/update-project';
import { createDeleteProjectUseCase } from '@use-cases/delete-project';

const projectRepo = createProjectRepository(db);
const noteRepo = createNoteRepository(db);
const boardRepo = createKanbanBoardRepository(db);
const listRepo = createKanbanListRepository(db);
const cardRepo = createKanbanCardRepository(db);
const markdownRepo = createMarkdownDocRepository(db);
const fileRepo = createProjectFileRepository(db);
const clientRepo = createClientRepository(db);
const getProjectDetails = getProjectDetail(projectRepo);
const updateProject = createUpdateProjectUseCase(projectRepo);
const deleteProject = createDeleteProjectUseCase(projectRepo);

export const load: PageServerLoad = async ({locals, params}) => {
    if (!locals.user) {
        throw redirect(302, './login');
    }

    try {
        const project = await getProjectDetails(locals.user.id, params.id);
        const projectId = params.id;
        const clients = await clientRepo.listByUser(locals.user.id);

        const [notes, boards, docs, files] = await Promise.all([
            noteRepo.listByProject(projectId),
            boardRepo.listByProject(projectId),
            markdownRepo.listByProject(projectId),
            fileRepo.listByProject(projectId),
        ]);

        let allCards: any[] = [];
        for (const board of boards) {
            const lists = await listRepo.listByBoard(board.id);
            for (const list of lists) {
                const cards = await cardRepo.listByList(list.id);
                allCards.push(...cards);
            }
        }

        return {
            project,
            clients,
            notes,
            cards: allCards,
            docs,
            files,
        };
    } catch (err) {
        throw error(404, 'Proyecto no encontrado');
    }
};

export const actions: Actions = {
    updateProject: async ({ request, locals, params }) => {
        if (!locals.user) throw redirect(302, '/login');

        const formData = await request.formData();
        const name = (formData.get('name') as string) ?? '';
        const description = formData.get('description') as string || null;
        const status = formData.get('status') as string;
        const budget = formData.get('budget') as string;
        const clientId = formData.get('clientId') as string || null;

        if (!name || name.trim().length === 0) {
            return fail(400, { error: 'El nombre es obligatorio' });
        }

        try {
            await updateProject(locals.user.id, params.id ?? '', {
                name: name.trim(),
                description: description?.trim() || null,
                status: (status as any) || 'pendiente',
                budget: budget ? parseFloat(budget) : null,
                client_id: clientId || null,
            });
        } catch (err) {
            return fail(400, { error: (err as Error).message });
        }

        return { success: true };
    },

    deleteProject: async ({ locals, params }) => {
        if (!locals.user) throw redirect(302, '/login');

        try {
            await deleteProject(locals.user.id, params.id ?? '');
        } catch (err) {
            return fail(400, { error: (err as Error).message });
        }

        throw redirect(302, '/dashboard');
    },
};
