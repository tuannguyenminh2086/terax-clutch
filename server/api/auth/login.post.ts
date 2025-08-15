import PocketBase from 'pocketbase';
import { loginSchema } from '~/utils/schemas/auth';

export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig();
  const pb = new PocketBase(config.public.pocketbaseUrl as string);

  const body = await readBody(event)
  const validationResult = loginSchema.safeParse(body)

  if (!validationResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid input',
      data: validationResult.error,
    })
  }

  const { email, password } = validationResult.data;

  try {
    const authData = await pb.collection('users').authWithPassword(email, password);

    console.log(pb.authStore.isValid , 'pb.authStore.isValid');
    console.log(pb.authStore.token, 'pb.authStore.token');
    console.log(pb.authStore.record, 'pb.authStore.record');

    // Set Secure Cookie
    // If authentication is successful, Pocketbase returns a token and the user record.
    // We store the token in a secure, HttpOnly cookie.
    // - httpOnly: The cookie cannot be accessed by client-side JS.
    // - secure: The cookie will only be sent over HTTPS.
    // - sameSite: 'lax' is a good balance of security and usability.
    setCookie(event, config.public.clutchAuthCookieName as string, authData.token, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 14, // 14 days
    });

    return { 
      user: {
        id: authData.record.id,
        email: authData.record.email,
        name: authData.record.name,
        avatar: authData.record.avatar,
      },
     }
  } catch (error) {
    console.error('Login Error:', error);
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication failed. Please check your credentials.',
    })
  }
})