import PocketBase from 'pocketbase';
import { startTrackingSchema } from '~/utils/schemas/tracking';

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const config = useRuntimeConfig();
  const pb = new PocketBase(config.public.pocketbaseUrl as string);
  await pb.collection('_superusers').authWithPassword(config.pocketbaseAdminEmail as string, config.pocketbaseAdminPassword as string);

  const body = await readBody(event);
  const { taskId, teamId } = startTrackingSchema.parse(body);

  const existingStatus = await pb.collection('user_status').getFirstListItem(`user.id = "${user.id}"`);
  if (existingStatus && existingStatus.active_task) {
    throw createError({ statusCode: 409, statusMessage: 'User is already tracking time on another task.' });
  }

  // 2. Create a preliminary time log record
  const newLog = await pb.collection('time_logs').create({
    task: taskId,
    user: user.id,
    duration_minutes: 0, // Will be updated on stop
    log_date: new Date().toISOString(),
  });

  // 3. Update the user's status to "tracking"
  const updatedStatus = await pb.collection('user_status').update(existingStatus.id, {
    status: 'tracking',
    active_task: taskId,
    active_log: newLog.id,
    team: teamId,
  });

  return updatedStatus;

});

