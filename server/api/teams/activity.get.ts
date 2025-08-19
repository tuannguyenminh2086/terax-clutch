export default defineEventHandler((event) => {
  if (!event.context.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
  // This data is pre-fetched by the auth middleware for the user's teams
  return event.context.teamActivity || [];
});