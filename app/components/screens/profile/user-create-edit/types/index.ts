import { TRole, TUser } from '../../../../../redux/types';

export interface TUserCreateEditRouteParams {
  item?: TUser;
  isUser?: boolean;
}

export type TInitialUserCreateEditFormValue = {
  firstname: string;
  lastname: string;
  username: string;
  address: string;
  password?: string;
  phone: string;
  role: TRole;
  confirmed: boolean;
};
