import { db } from "@infrastructure/db/connection";
import type { PageServerLoad } from "./$types";
import { redirect, fail, type Actions } from '@sveltejs/kit';

import { createNoteRepository } from "@infrastructure/db/repositories/notes-repository";
import { createProjectRepository } from "@infrastructure/db/repositories/project-repository";

import { createNoteUseCase } from "@core/use-cases/create-note";
import { createDeleteNoteUseCase } from "@core/use-cases/delete-note";
import { createUpdateNoteUseCase } from "@core/use-cases/update-note";
import { getProjectDetail } from "@core/use-cases/get-project-detail";

const noteRepo = createNoteRepository(db);
const projectRepo = createProjectRepository(db);

const createNote = createNoteUseCase(noteRepo, projectRepo);
const deleteNote = createDeleteNoteUseCase(noteRepo, projectRepo);
const updateNote = createUpdateNoteUseCase(noteRepo, projectRepo);
const getDetailProject = getProjectDetail(projectRepo);

export const load: PageServerLoad = async({locals, params}) => {

    if (!locals.user) {
        throw redirect(302, "/login")
    }

    const project = await getDetailProject(locals.user.id, params.id);
    const notes = await noteRepo.listByProject(params.id);

    return { project, notes };
}

export const actions: Actions = { 
    createNote: async ({locals, request, params}) => {
        if (!locals.user) {
            throw redirect(302,"/login")
        }

        const projectId = params.id;
        if (!projectId) {
            return fail(400, {error: 'Proyecto no encontrado'})
        }

        const formData = await request.formData()
        const content = formData.get("content") as string
        const color = formData.get("color") as string | null
        
        const existingNotes = await noteRepo.listByProject(projectId)
        const order = existingNotes.length + 1
        
        try {
            await createNote(locals.user.id, projectId, {content, order, color: color || undefined})
        } catch (err){
            return fail(400, {error: (err as Error).message})
        }

        throw redirect(302, `/projects/${projectId}/notes`);
    },

    deleteNote: async ({locals, request, params}) => {
        if (!locals.user) {
            throw redirect(302, "/login")
        }

        const projectId = params.id;
        if (!projectId) {
            return fail(400, {error: 'Proyecto no encontrado'})
        }

        const formData = await request.formData()
        const noteId = formData.get("noteId") as string

        try {
            await deleteNote(locals.user.id, noteId)
        } catch (err) {
            return fail(400, {error: (err as Error).message})
        }

        throw redirect(302, `/projects/${projectId}/notes`);
    },

    toggleComplete: async ({locals, request, params}) => {
        if (!locals.user) {
            throw redirect(302, "/login")
        }

        const projectId = params.id;
        if (!projectId) {
            return fail(400, {error: 'Proyecto no encontrado'})
        }

        const formData = await request.formData()
        const noteId = formData.get("noteId") as string

        const note = await noteRepo.findById(noteId)
        if (!note) {
            return fail(400, {error: 'Nota no encontrada'})
        }

        try {
            await updateNote(locals.user.id, noteId, { completed: note.completed ? 0 : 1 })
        } catch (err) {
            return fail(400, {error: (err as Error).message})
        }

        throw redirect(302, `/projects/${projectId}/notes`);
    },

    editNote: async ({locals, request, params}) => {
        if (!locals.user) {
            throw redirect(302, "/login")
        }

        const projectId = params.id;
        if (!projectId) {
            return fail(400, {error: 'Proyecto no encontrado'})
        }

        const formData = await request.formData()
        const noteId = formData.get("noteId") as string
        const content = formData.get("content") as string
        const color = formData.get("color") as string | null

        try {
            await updateNote(locals.user.id, noteId, {
                content: content || undefined,
                color: color || undefined,
            })
        } catch (err) {
            return fail(400, {error: (err as Error).message})
        }

        throw redirect(302, `/projects/${projectId}/notes`);
    }
}