import { ParamListBase } from '@react-navigation/native';
import React from 'react';

import { TUser } from '../../../../../redux/types';

export interface IUserList {
  users: TUser[];
  label: string;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  previousButtonDisable: boolean;
  nextButtonDisable: boolean;
  totalItems: number;
  searchQuery: string;
  hasSearched: boolean;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setHasSearched: React.Dispatch<React.SetStateAction<boolean>>;
}
export type TUserListNavigationProps = {
  item: TUser;
} & ParamListBase;
