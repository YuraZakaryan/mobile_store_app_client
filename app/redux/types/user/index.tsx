import { TItemsWithTotalLength } from '../global';

export enum EAuthMode {
  LOGIN = 'login',
  REGISTRATION = 'registration',
}
export enum EResetPasswordMode {
  MAIL_SECTION = 'mail-section',
  OPT_SECTION = 'otp-section',
  NEW_PASS_SECTION = 'new-pass-section',
}

export type TRole = 'ADMIN' | 'MODERATOR' | 'USER' | 'SUPERUSER';

export type TUser = {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  mail: string;
  address: string;
  phone: string;
  role: TRole;
  confirmed: boolean;
  stockToken: string;
  banned: boolean;
};

export type TStateStatus = {
  isLoading: boolean | null;
  isError?: boolean;
  isNetworkError?: boolean;
};
export type TResetPassword = {
  mode: EResetPasswordMode;
  mail: string;
  otp: string;
  isLoading: boolean;
  isError: boolean;
};
export type TCounterParty = {
  id: string;
  name: string;
  code: string;
  externalCode: string;
  legalTitle: string;
  phone: string;
};
export type TInitialUserState = {
  isAuth: boolean | null;
  authMode: EAuthMode;
  resetPassword: TResetPassword;
  user: TUser | null;
  users: TItemsWithTotalLength<TUser[]>;
  counterParties: TItemsWithTotalLength<TCounterParty[]>;
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
export type TOtpData = {
  message: string;
  mail: string;
  otp: string;
};
export type TUserCreateOrUpdateErrorResponseMessage = {
  message: string;
  statusCode: number;
};
