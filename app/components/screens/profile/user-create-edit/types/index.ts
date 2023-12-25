import { TRole, TUser } from '../../../../../redux/types';

export interface TUserCreateEditRouteParams {
  item?: TUser;
}

export type TInitialUserCreateEditFormValue = {
  firstname: string;
  lastname: string;
  username: string;
  password?: string;
  phone: string;
  role: TRole;
  confirmed: boolean;
};
