import { db } from "@infrastructure/db/connection";
import type { PageServerLoad } from "./$types";
import { redirect, fail, type Actions } from '@sveltejs/kit';

import { createProjectFileRepository } from "@infrastructure/db/repositories/file-repository";
import { createFileUseCase } from "@use-cases/create-file";
import { listFilesUseCase } from "@use-cases/list-files";
import { deleteFileUseCase } from "@use-cases/delete-file";
import { saveFileToR2 } from "@infrastructure/storage/r2-storage";

import { createProjectRepository } from "@infrastructure/db/repositories/project-repository";
import type { TypeFile } from "@entities/file-entity";

const fileRepo = createProjectFileRepository(db);
const projectRepo = createProjectRepository(db);

const createFile = createFileUseCase(fileRepo, projectRepo);
const listFiles = listFilesUseCase(fileRepo, projectRepo);
const deleteFile = deleteFileUseCase(fileRepo, projectRepo);

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!locals.user) {
    throw redirect(302, '/login');
  }

  const files = await listFiles(locals.user.id, params.id);
  return { files };
};

export const actions: Actions = {
  createFile: async ({ request, locals, params }) => {
    if (!locals.user) {
      throw redirect(302, '/login');
    }

    const projectId = params.id;
    if (!projectId) {
      return fail(400, { error: 'Proyecto no encontrado' });
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const type = formData.get('type') as TypeFile;
    const file = formData.get('file') as File;

    try {
      const url = await saveFileToR2(file);

      await createFile(locals.user.id, projectId, {
        name,
        type,
        url_or_path: url
      });
    } catch (error) {
      return fail(400, { error: (error as Error).message });
    }

    throw redirect(302, `/projects/${projectId}/files`);
  },

  deleteFile: async ({ request, locals, params }) => {
    if (!locals.user) {
      throw redirect(302, '/login');
    }

    const projectId = params.id;
    if (!projectId) {
      return fail(400, { error: 'Proyecto no encontrado' });
    }

    const formData = await request.formData();
    const fileId = formData.get('fileId') as string;

    try {
      await deleteFile(locals.user.id, fileId);
    } catch (error) {
      return fail(400, { error: (error as Error).message });
    }

    throw redirect(302, `/projects/${projectId}/files`);
  }
};