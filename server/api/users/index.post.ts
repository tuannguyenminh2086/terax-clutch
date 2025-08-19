import { z } from 'zod';
import { createPocketBaseInstance } from '~/utils/helpers/pocketbase';
import type { IUser } from '~/utils/models';

const getUsersSchema = z.object({
  userIds: z.array(z.string()).min(1, 'At least one user ID is required.'),
});

export default defineEventHandler(async (event): Promise<IUser[]> => {
  const user = event.context.user;
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });

  const body = await readBody(event);
  const { userIds } = getUsersSchema.parse(body);
  
  const pb = await createPocketBaseInstance(event);

  // Build the filter to fetch multiple users by their ID.
  const filter = userIds.map(id => `id = "${id}"`).join(' || ');

  const users = await pb.collection('users').getFullList<IUser>({
    filter,
    // Specify which fields to return for security and efficiency.
    fields: 'id,name,avatar',
  });

  return users;
}); 