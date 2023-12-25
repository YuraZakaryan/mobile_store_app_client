import { ParamListBase } from '@react-navigation/native';

import { TUser } from '../../../../../redux/types';

export interface IUserList {
  users: TUser[];
  label: string;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  previousButtonDisable: boolean;
  nextButtonDisable: boolean;
  totalItems: number;
}
export type TUserListNavigationProps = {
  item: TUser;
} & ParamListBase;
