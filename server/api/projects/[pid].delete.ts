// Deletes a project by its ID.

import { createPocketBaseInstance } from '~/utils/helpers/pocketbase';
import { requireAuth, isTeamMember } from '~/utils/helpers/auth';

export default defineEventHandler(async (event) => {
  const user = requireAuth(event);

  const pid = event.context.params?.pid;
  if (!pid) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Project ID is required.',
    });
  }

  const pb = await createPocketBaseInstance(event);

  const project = await pb.collection('projects').getOne(pid);
  if (!project) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Project not found.',
    });
  }

  if (!isTeamMember(user, project.team)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    });
  }

  await pb.collection('projects').delete(pid);

  return { success: true };
});

