import type { RecordModel } from "pocketbase";


export interface IPlan extends RecordModel {
  id: string;
  name: string;
  max_members: number;
  max_projects: number;
}

export interface ISubscription extends RecordModel {
  id: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled';
  current_period_end: string;
  plan: IPlan;
}

export interface ITeam extends RecordModel {
  id: string;
  name: string;
  role: 'admin' | 'member';
  subscription: ISubscription | null;
}

export interface IUser extends RecordModel {
  id: string;
  name: string;
  email: string;
  avatar: string;
  teams: ITeam[];
}

export interface IUserActivity extends RecordModel {
  id: string;
  status: 'tracking' | 'online' | 'offline';
  expand: {
      user: IUser;
      active_task?: { title: string };
  };
}

export interface IProject extends RecordModel {
  id: string;
  name: string;
  team: string; // team ID
  owner: IUser;
  members: IUser[]; // array of user IDs
}

export interface ITask extends RecordModel {
  title: string;
  list: string; // list ID
  project: string; // project ID
  order: number;
  assignees?: string[]; // array of user IDs
  start_date?: string;
  due_date?: string;
}