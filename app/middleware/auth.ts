import { useAuth } from "~/composable/useAuth";

export default defineNuxtRouteMiddleware(async (to) => {
  // This middleware should only run on the client-side
  const { user, fetchUser } = useAuth();

  // We need to fetch the user to ensure we have the latest auth state.
  // This is crucial for page reloads.
  await fetchUser();

  // If there is no user and the target route is not the login page,
  // redirect the user to the login page.
  if (!user.value && to.path !== '/login') {
    console.log('Redirecting to login...');
    return navigateTo('/login');
  }
});