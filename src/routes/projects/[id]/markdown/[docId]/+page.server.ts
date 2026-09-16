import type { PageServerLoad } from './$types';
import { redirect, fail, type Actions } from '@sveltejs/kit';
import { db } from '@infrastructure/db/connection';

import { createMarkdownDocRepository } from '@infrastructure/db/repositories/markdown-doc-repository';
import { createMarkdownDocVersionRepository } from '@infrastructure/db/repositories/markdown-version-repository';
import { createProjectRepository } from '@infrastructure/db/repositories/project-repository';

import { getMarkdownUseCase } from '@use-cases/get-markdown-doc';
import { createUpdateMarkdownDocUseCase } from '@use-cases/update-markdown-doc';

const mdRepo = createMarkdownDocRepository(db);
const mdVersionRepo = createMarkdownDocVersionRepository(db);
const projectRepo = createProjectRepository(db);

const getMarkdownDoc = getMarkdownUseCase(mdRepo, projectRepo);
const updateMarkdownDoc = createUpdateMarkdownDocUseCase(mdRepo, mdVersionRepo, projectRepo);

export const load: PageServerLoad = async ({ locals, params }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    const docId = params.docId;
    if (!docId) {
        throw redirect(302, '/dashboard');
    }

    const doc = await getMarkdownDoc(locals.user.id, docId);

    return { doc };
};

export const actions: Actions = {
    updateDoc: async ({ locals, request, params }) => {
        if (!locals.user) {
            throw redirect(302, '/login');
        }

        const docId = params.docId;
        if (!docId) {
            return fail(400, { error: 'Documento no encontrado' });
        }

        const formData = await request.formData();
        const content = formData.get('content') as string;

        try {
            await updateMarkdownDoc(locals.user.id, docId, content);
        } catch (err) {
            return fail(400, { error: (err as Error).message });
        }

        return { success: true };
    }
};
