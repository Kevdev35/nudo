import type { PageServerLoad } from './$types';
import { redirect, error } from '@sveltejs/kit';
import { db } from '@infrastructure/db/connection';
import { createProjectRepository } from '@infrastructure/db/repositories/project-repository';
import { createNoteRepository } from '@infrastructure/db/repositories/notes-repository';
import { createKanbanBoardRepository } from '@infrastructure/db/repositories/kanban-board-repository';
import { createKanbanListRepository } from '@infrastructure/db/repositories/kanban-list-repository';
import { createKanbanCardRepository } from '@infrastructure/db/repositories/kanban-card-repository';
import { createMarkdownDocRepository } from '@infrastructure/db/repositories/markdown-doc-repository';
import { createProjectFileRepository } from '@infrastructure/db/repositories/file-repository';
import { getProjectDetail } from '@core/use-cases/get-project-detail';

const projectRepo = createProjectRepository(db);
const noteRepo = createNoteRepository(db);
const boardRepo = createKanbanBoardRepository(db);
const listRepo = createKanbanListRepository(db);
const cardRepo = createKanbanCardRepository(db);
const markdownRepo = createMarkdownDocRepository(db);
const fileRepo = createProjectFileRepository(db);
const getProjectDetails = getProjectDetail(projectRepo);

export const load: PageServerLoad = async ({locals, params}) => {
    if (!locals.user) {
        throw redirect(302, './login');
    }

    try {
        const project = await getProjectDetails(locals.user.id, params.id);
        const projectId = params.id;
        

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
            notes,
            cards: allCards,
            docs,
            files,
        };
    } catch (err) {
        throw error(404, 'Proyecto no encontrado');
    }
};
