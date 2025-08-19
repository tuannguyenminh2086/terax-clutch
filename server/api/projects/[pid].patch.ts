// Updates a project by its ID.

import { createPocketBaseInstance } from '~/utils/helpers/pocketbase';
import { requireAuth } from '~/utils/helpers/auth';
import { IProject } from "~/utils/models";
import { updateProjectSchema } from "~/utils/schemas/projects";

export default defineEventHandler(async (event): Promise<IProject | { error: string }> => {
    const user = requireAuth(event);

    const projectId = event.context.params?.pid;
    if (!projectId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Project ID is required.',
        });
    }

    const body = await readBody(event);
    const dataToUpdate = updateProjectSchema.parse(body);

    const pb = await createPocketBaseInstance(event);

    const project = await pb.collection('projects').getOne<IProject>(projectId);

    if (project.owner !== user.id) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden: Only the project owner can make changes.',
        });
    }

    const updatedProject = await pb.collection('projects').update<IProject>(projectId, dataToUpdate);

    return updatedProject;
})
