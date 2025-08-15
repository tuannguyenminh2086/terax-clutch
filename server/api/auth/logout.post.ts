export default defineEventHandler(async (event) => {
  // To log the user out, we simply clear the authentication cookie.
  // We do this by setting its value to an empty string and its maxAge to -1,
  // which tells the browser to expire it immediately.
  const config = useRuntimeConfig();
  setCookie(event, config.public.clutchAuthCookieName as string, '', {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: -1, // Expire the cookie immediately
  });

  // Return a success message to the client.
  return {
    message: 'Successfully logged out.',
  };
});
