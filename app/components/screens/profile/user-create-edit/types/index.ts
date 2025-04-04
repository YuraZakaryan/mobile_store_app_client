import { EPriceType, TRole, TUser } from '../../../../../redux/types';

export interface TUserCreateEditRouteParams {
  item?: TUser;
  isUser?: boolean;
}

export type TInitialUserCreateEditFormValue = {
  firstname: string;
  lastname: string;
  username: string;
  mail: string;
  address: string;
  password?: string;
  phone: string;
  priceType: EPriceType;
  discountPercent: number;
  stockToken: string;
  role: TRole;
  confirmed: boolean;
};
