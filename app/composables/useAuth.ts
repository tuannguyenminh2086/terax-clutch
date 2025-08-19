import type { ITeam, IUser, IUserActivity } from "~/utils/models";
import PocketBase from 'pocketbase';


let pbClient: PocketBase | null = null;
let unsubscribeActivity: (() => void) | null = null;

export const useAuth = () => {
    const user = useState<IUser | null>('user', () => null);
    const activeTeam = useState<ITeam | null>('activeTeam', () => null);
    const teamActivity = useState<IUserActivity[]>('teamActivity', () => []);
    const activeSubscription = computed(() => {
        return activeTeam.value ? activeTeam.value.subscription : null;
    });

    const activePlan = computed(() => {
        return activeSubscription.value ? activeSubscription.value.plan : null;
    });

    const config = useRuntimeConfig();


    const initPocketBaseClient = () => {
        if (!pbClient) {
          pbClient = new PocketBase(config.public.pocketbaseUrl);
        }
      };

    const fetchUser = async () => {
        try {
            const fetchedUser = await $fetch('/api/auth/user', {
                retry: false,
            });
            
            user.value = fetchedUser;
            console.log(user.value, 'user.value');

            if (fetchedUser && fetchedUser.teams && fetchedUser.teams.length > 0) {
                // If there's no active team set or the old one is no longer valid,
                // set the first team as the default active team.
                if (!activeTeam.value || !fetchedUser.teams.some((t:ITeam) => activeTeam.value && t.id === activeTeam.value.id)) {
                    activeTeam.value = fetchedUser.teams[0];
                }
                
              } else {  
                activeTeam.value = null;
              }
    
      
        } catch (error) {
            console.error('Error fetching user:', error);
            user.value = null;
            activeTeam.value = null;
        }
    }

    const setActiveTeam = (team:ITeam) => {
        if (user.value && user.value.teams.some(t => t.id === team.id)) {
            activeTeam.value = team;
        } else {
            console.error("User is not a member of the selected team.");
        }

        // When the team changes, re-subscribe to the new team's activity
        subscribeToTeamActivity();
    };

    const fetchTeamActivity = async () => {
        if (!activeTeam.value) return;
        try {
            const activity = await $fetch<IUserActivity[]>('/api/teams/activity');
            teamActivity.value = activity;
        } catch (error) {
            console.error("Failed to fetch team activity:", error);
            teamActivity.value = [];
        }
    };

    const subscribeToTeamActivity = () => {
        initPocketBaseClient();
        if (!pbClient || !activeTeam.value) return;
    
        // First, unsubscribe from any existing listeners to avoid duplicates
        if (unsubscribeActivity) unsubscribeActivity();
    
        // Subscribe to ALL changes in the 'user_status' collection
        pbClient!.collection('user_status').subscribe('*', async (e) => {
          console.log('Real-time event:', e.action, e.record);
    
          // IMPORTANT: Filter events on the client-side for the active team
          if (e.record.team !== activeTeam.value?.id) {
            return;
          }
          
          // The real-time event doesn't include expanded relations,
          // so we must fetch the full record to get user and task details.
          const updatedRecord = await pbClient!.collection('user_status').getOne<IUserActivity>(e.record.id, {
              expand: 'user,active_task'
          });
    
          const index = teamActivity.value.findIndex((item: IUserActivity) => item.id === updatedRecord?.id);
    
          if (e.action === 'delete') {
            if (index !== -1) teamActivity.value.splice(index, 1);
          } else { // 'create' or 'update'
            if (index !== -1) {
              teamActivity.value[index] = updatedRecord; // Update existing
            } else {
              teamActivity.value.push(updatedRecord); // Add new
            }
          }
        }).then(unsub => {
          unsubscribeActivity = unsub; // Store the unsubscribe function
        });
    };
    
    const unsubscribeFromTeamActivity = () => {
        if (unsubscribeActivity) {
            unsubscribeActivity();
            unsubscribeActivity = null;
        }
    };


     // Function to log the user out.
    const logout = async () => {
        // Call the logout API route to clear the server-side cookie.
        await $fetch('/api/auth/logout', { method: 'POST' });
        // Clear the local user state.
        user.value = null;
        activeTeam.value = null;
        // You can optionally redirect the user to the login page.
        await navigateTo('/login');
    };


    return {
        user,
        fetchUser,
        logout,
        activeTeam,
        setActiveTeam,
        activeSubscription,
        activePlan,
        teamActivity,
        fetchTeamActivity,
        subscribeToTeamActivity,
        unsubscribeFromTeamActivity,
    }
}
