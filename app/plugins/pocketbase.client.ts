import PocketBase from 'pocketbase';

export default defineNuxtPlugin(() => {

  const runtimeConfig = useRuntimeConfig();
  const pb = new PocketBase(runtimeConfig.public.pocketbaseUrl as string); // Replace with your PocketBase URL

   // Optional: Refresh auth token on client-side load if a token exists in local storage
  // This is important for maintaining authentication across page refreshes
  console.log(pb.authStore.isValid && pb.authStore.token, 'pb.authStore.isValid && pb.authStore.token')
  console.log(pb.authStore.record, 'pb.authStore.record')
  
  if (pb.authStore.isValid && pb.authStore.token) {
    pb.authStore.token && pb.authStore.record && pb.collection('users').authRefresh();
  }

  return {
    provide: {
      pb
    }
  };
});