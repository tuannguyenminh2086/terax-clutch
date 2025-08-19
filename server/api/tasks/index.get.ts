// Lists all tasks for a given project.

import { requireAuth } from '~/utils/helpers/auth';
import { createPocketBaseInstance } from '~/utils/helpers/pocketbase';
import type { ITask, IProject, ITeam, IUser } from '~/utils/models';

export default defineEventHandler(async (event): Promise<ITask[]> => {
  const user = requireAuth(event);

  const { projectId } = getQuery(event);
  if (!projectId || typeof projectId !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Project ID is required.' });
  }

  const pb = await createPocketBaseInstance(event);

  // Security check: Verify the user is part of the project's team before fetching tasks.
  const project = await pb.collection('projects').getOne<IProject>(projectId);
  const isTeamMember = user.teams.some((team: ITeam) => team.id === project.team);
  if (!isTeamMember) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  }



  const tasks = await pb.collection('tasks').getFullList<ITask>({
    filter: `project.id = "${projectId}"`,
    sort: 'order',
    expand: 'list, assignees, project',
  });
  
  return tasks;
});