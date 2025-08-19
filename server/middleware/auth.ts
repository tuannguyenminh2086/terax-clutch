// server/middleware/auth.ts
// This middleware runs on every server request. Its job is to verify the auth
// cookie and attach the authenticated user's data to the request context.
import PocketBase from 'pocketbase';

export default defineEventHandler(async(event) => {
  const config = useRuntimeConfig();
  const pb = new PocketBase(config.public.pocketbaseUrl as string);

  // get the cookie
  const authCookie = getCookie(event, config.public.clutchAuthCookieName as string);

  if (!authCookie) {
    // If there's no cookie, there's no user.
    event.context.user = null;
    return;
  }

  try {
    // The cookie just contains the token, so we load it using save()
    pb.authStore.save(authCookie, null);

    // This will verify the token and refresh it, updating the user record
    await pb.collection('users').authRefresh();
    const userRecord = pb.authStore.record; 

    // 1. Fetch Team Memberships
    // Get all the teams the user is a part of.
    const teamMemberships = await pb.collection('team_members').getFullList({
      filter: `user.id = "${userRecord?.id}"`,
      expand: 'team',
    });

    console.log(teamMemberships, 'teamMemberships')

    if (teamMemberships.length === 0) {
      // If the user isn't part of any team, we can stop here.
      event.context.user = { ...userRecord, teams: [] };
      return;
    }

    // Helper function to fetch and map subscriptions by team ID
    const getSubscriptionsByTeamId = async (teamIds: string[]) => {
        if (teamIds.length === 0) {
            return {};
        }
        const teamsFilter = teamIds.map(id => `team.id = "${id}"`).join(' || ');
        const subscriptions = await pb.collection('subscriptions').getFullList({
            filter: teamsFilter,
            expand: 'plan',
        });

        return subscriptions.reduce((acc:any, sub:any) => {
          if (!sub?.team) return acc;
          acc[sub.team] = {
              status: sub.status,
              current_period_end: sub.current_period_end,
              plan: {
                  id: sub.expand.plan.id,
                  name: sub.expand.plan.name,
                  max_members: sub.expand.plan.max_members,
                  max_projects: sub.expand.plan.max_projects,
              }
          };
          return acc;
        }, {});
    };

    // 2. Fetch subscriptions for all teams
    const teamIds = teamMemberships.map(tm => tm.team);
    const subscriptionsByTeamId = await getSubscriptionsByTeamId(teamIds);

    // 3. Construct teams array with subscriptions
    const teams = teamMemberships.map(tm => ({
        id: tm.team,
        name: tm.team,
        role: tm.role,
        subscription: subscriptionsByTeamId[tm.team] || null,
    }));

    if (teamIds.length > 0) {
      const activityFilter = teamIds.map(id => `team.id = "${id}"`).join(' || ');
      const teamActivity = await pb.collection('user_status').getFullList({
        filter: activityFilter,
        expand: 'user,active_task',
      });
      
      // Attach to context to be used by a new API endpoint
      event.context.teamActivity = teamActivity;
    } 

    // Attach the user model to the event context
    event.context.user = {
      ...userRecord,
      teams: teams,
    };

    

  } catch (error) {
    // If authRefresh fails (e.g., token is invalid), clear the auth store
    // and set the user to null.
    pb.authStore.clear();
    event.context.user = null;
  }
})