import { TItemsWithTotalLength } from '../global';

export enum EAuthMode {
  LOGIN = 'login',
  REGISTRATION = 'registration',
}

export type TRole = 'ADMIN' | 'MODERATOR' | 'USER';

export type TUser = {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  address: string;
  phone: string;
  role: TRole;
  confirmed: boolean;
  banned: boolean;
};

export type TStateStatus = {
  isLoading: boolean;
  isError: boolean;
};

export type TInitialUserState = {
  isAuth: boolean | null;
  authMode: EAuthMode;
  user: TUser | null;
  users: TItemsWithTotalLength<TUser[]>;
  unconfirmedUsers: TItemsWithTotalLength<TUser[]>;
  bannedUsers: TItemsWithTotalLength<TUser[]>;
  login: TStateStatus;
  registration: TStateStatus;
  fetchMe: TStateStatus;
  createUser: TStateStatus;
  updateUser: TStateStatus;
  cancelUser: TStateStatus;
  banUser: TStateStatus;
  updatePassword: TStateStatus;
};

export type TTokens = {
  access_token: string;
  refresh_token: string;
};

export type TPayloadActionUser = {
  user: TUser;
  tokens: TTokens;
};
