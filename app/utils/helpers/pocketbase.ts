// server/utils/pocketbase.ts
import PocketBase from 'pocketbase';
import { H3Event } from 'h3';

export async function createPocketBaseInstance(event: H3Event) {
  const config = useRuntimeConfig();
  const pb = new PocketBase(config.public.pocketbaseUrl);
  const authCookie = getCookie(event, config.public.clutchAuthCookieName as string);

  if (!authCookie) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  pb.authStore.save(authCookie, null);

  if (!pb.authStore.isValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  return pb;
}
