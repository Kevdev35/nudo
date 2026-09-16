import { createMarkdownDocUseCase } from "@use-cases/create-markdown-doc";
import { db } from "@infrastructure/db/connection";
import type { PageServerLoad } from "./$types";
import { redirect, fail, type Actions } from '@sveltejs/kit';

import { createProjectRepository } from "@infrastructure/db/repositories/project-repository"
import { listMarkdownDocsByProject } from "@use-cases/list-markdown-doc-by-project"
import { createMarkdownDocRepository } from "@infrastructure/db/repositories/markdown-doc-repository";

const projectRepo = createProjectRepository(db);
const markdownDocRepo = createMarkdownDocRepository(db);
const createMarkdownDoc = createMarkdownDocUseCase(markdownDocRepo, projectRepo);
const listMarkdownDocs = listMarkdownDocsByProject(markdownDocRepo, projectRepo);

export const load: PageServerLoad = async({locals, params}) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    const projectId = params.id;
    if (!projectId) {
        throw redirect(302, '/dashboard');
    }

    const markdownDocs = await listMarkdownDocs(locals.user.id, projectId);
    
    return { markdownDocs };
}

export const actions: Actions = {
  createMarkdownDoc: async ({ locals, request, params }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    const projectId = params.id;
    if (!projectId) {
        return fail(400, { error: 'Proyecto no encontrado' });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;

    let newDoc;
    try {
      newDoc = await createMarkdownDoc(locals.user.id, projectId, { title });
    } catch (error) {
      return fail(400, { error: (error as Error).message });
    }

    throw redirect(302, `/projects/${projectId}/markdown/${newDoc.id}`);
  }
};