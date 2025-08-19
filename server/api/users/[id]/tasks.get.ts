import { requireAuth } from '~/utils/helpers/auth';
import { createPocketBaseInstance } from '~/utils/helpers/pocketbase';
import type { ITask, ITeam } from '~/utils/models';

export default defineEventHandler(async (event): Promise<ITask[]> => {
   const user = requireAuth(event);

    const targetUserId = event.context.params?.id;
    if (!targetUserId) throw createError({ statusCode: 400, statusMessage: 'Target user ID is required.' });
    
    // A user can only see their own assigned tasks via this endpoint for simplicity and security.
    if (user.id !== targetUserId) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden: You can only view your own assigned tasks.' });
    }

    const pb = await createPocketBaseInstance(event);

    // Get all teams the requesting user is a member of.
    const teamIds = user.teams.map((team: ITeam) => team.id);
    if (teamIds.length === 0) {
        return []; // If user is not in any teams, they have no tasks.
    }

    // Build a filter to find tasks that are:
    // 1. Assigned to the target user.
    // 2. Part of a project that belongs to a team the requesting user is a member of.
    const teamFilter = `(${teamIds.map((id: string) => `project.team.id = "${id}"`).join(' || ')})`;
    const finalFilter = `assignees ~ "${targetUserId}" && ${teamFilter}`;

    const tasks = await pb.collection('tasks').getFullList<ITask>({
        filter: finalFilter,
        expand: 'assignees,project,list'
    });

    return tasks;
});