import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '@infrastructure/db/connection';
import { createNoteRepository } from '@infrastructure/db/repositories/notes-repository';
import { createKanbanBoardRepository } from '@infrastructure/db/repositories/kanban-board-repository';
import { createKanbanListRepository } from '@infrastructure/db/repositories/kanban-list-repository';
import { createKanbanCardRepository } from '@infrastructure/db/repositories/kanban-card-repository';
import { createMarkdownDocRepository } from '@infrastructure/db/repositories/markdown-doc-repository';
import { createProjectFileRepository } from '@infrastructure/db/repositories/file-repository';

const noteRepo = createNoteRepository(db);
const boardRepo = createKanbanBoardRepository(db);
const listRepo = createKanbanListRepository(db);
const cardRepo = createKanbanCardRepository(db);
const markdownRepo = createMarkdownDocRepository(db);
const fileRepo = createProjectFileRepository(db);

export const GET: RequestHandler = async ({ locals, params, url }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    const q = url.searchParams.get('q')?.trim().toLowerCase() ?? '';
    if (q.length < 2) {
        return json({ results: [] });
    }

    const projectId = params.id;
    const results: { id: string; title: string; type: string; href: string; excerpt?: string }[] = [];

    const notes = await noteRepo.listByProject(projectId);
    for (const n of notes) {
        if (n.content?.toLowerCase().includes(q)) {
            results.push({
                id: n.id,
                title: n.content.slice(0, 80),
                type: 'nota',
                href: `/projects/${projectId}/notes`,
                excerpt: n.content.slice(0, 120),
            });
        }
    }

    const boards = await boardRepo.listByProject(projectId);
    for (const board of boards) {
        const lists = await listRepo.listByBoard(board.id);
        for (const list of lists) {
            const cards = await cardRepo.listByList(list.id);
            for (const c of cards) {
                if (c.title?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q)) {
                    results.push({
                        id: c.id,
                        title: c.title,
                        type: 'tarea',
                        href: `/projects/${projectId}/kanban`,
                        excerpt: c.description?.slice(0, 120),
                    });
                }
            }
        }
    }

    const docs = await markdownRepo.listByProject(projectId);
    for (const d of docs) {
        if (d.title?.toLowerCase().includes(q) || d.current_content?.toLowerCase().includes(q)) {
            results.push({
                id: d.id,
                title: d.title,
                type: 'doc',
                href: `/projects/${projectId}/markdown/${d.id}`,
                excerpt: d.current_content?.slice(0, 120),
            });
        }
    }

    const files = await fileRepo.listByProject(projectId);
    for (const f of files) {
        if (f.name?.toLowerCase().includes(q)) {
            results.push({
                id: f.id,
                title: f.name,
                type: 'archivo',
                href: `/projects/${projectId}/files`,
            });
        }
    }

    return json({ results: results.slice(0, 10) });
};
