import PocketBase from 'pocketbase';

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const config = useRuntimeConfig();
  const pb = new PocketBase(config.public.pocketbaseUrl as string);
  await pb.collection('_superusers').authWithPassword(config.pocketbaseAdminEmail as string, config.pocketbaseAdminPassword as string);

  // 1. Get the user's current status
  const userStatus = await pb.collection('user_status').getFirstListItem(`user.id = "${user.id}"`, {
    expand: 'active_log'
  });

  if (!userStatus || !userStatus.active_log) {
    throw createError({ statusCode: 400, statusMessage: 'User is not currently tracking time.' });
  }

  // 2. Calculate the duration
  const logRecord = userStatus?.expand?.active_log;
  const startTime = new Date(logRecord?.created);
  const stopTime = new Date();
  const durationMinutes = Math.round((stopTime.getTime() - startTime.getTime()) / (1000 * 60));

  // 3. Update the time_logs record with the final duration
  await pb.collection('time_logs').update(logRecord?.id, {
    duration_minutes: durationMinutes > 0 ? durationMinutes : 1, // Log at least 1 minute
  });

  // 4. Update the user's status back to "online"
  const updatedStatus = await pb.collection('user_status').update(userStatus?.id, {
    status: 'online',
    active_task: null,
    active_log: null,
  });

  return updatedStatus;

});
