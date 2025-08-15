import type { ITeam, IUser } from "~/utils/models";

export const useAuth = () => {
    const user = useState<IUser | null>('user', () => null);
    const activeTeam = useState<ITeam | null>('activeTeam', () => null);
    const activeSubscription = computed(() => {
        return activeTeam.value ? activeTeam.value.subscription : null;
    });

    const activePlan = computed(() => {
        return activeSubscription.value ? activeSubscription.value.plan : null;
    });

    const fetchUser = async () => {
        try {
            const fetchedUser = await $fetch('/api/auth/user', {
                retry: false,
            });
            
            user.value = fetchedUser;

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
    }
}
