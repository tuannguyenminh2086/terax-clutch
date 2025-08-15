export interface ITeamSubscription {
  status: string;
  current_period_end: string;
  plan: {
    id: string;
    name: string;
    max_members: number;
    max_projects: number;
  };
}


export interface ITeam {
  id: string;
  name: string;
  role: string;
  subscription: ITeamSubscription | null;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  teams: ITeam[];
}