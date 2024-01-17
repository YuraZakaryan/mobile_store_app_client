import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import React from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';

import { UserList } from './wrappers/user-list';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import {
  fetchBannedUsers,
  fetchUnconfirmedUsers,
  fetchUsersThunk,
} from '../../../../redux/http/userThunk';
import { LIMIT_NUMBER } from '../../../../utils/constants';
import { CreateItemButton, Main } from '../../../wrappers';

export const UsersControl = () => {
  const dispatch = useAppDispatch();
  const { createUser, updateUser, cancelUser, banUser } = useAppSelector((state) => state.user);
  const [currentUserPage, setUserCurrentPage] = React.useState<number>(1);
  const [currentUnConfirmedUserPage, setUserConfirmedCurrentPage] = React.useState<number>(1);
  const [currentBannedUserPage, setUserBannedCurrentPage] = React.useState<number>(1);
  const isLoading =
    createUser.isLoading || updateUser.isLoading || cancelUser.isLoading || banUser.isLoading;

  const fetchUsersData = (): void => {
    dispatch(fetchUsersThunk({ page: currentUserPage, limit: LIMIT_NUMBER }));
  };
  const fetchUnconfirmedUsersData = (): void => {
    dispatch(fetchUnconfirmedUsers({ page: currentUnConfirmedUserPage, limit: LIMIT_NUMBER }));
  };
  const fetchBannedUsersData = (): void => {
    dispatch(fetchBannedUsers({ page: currentBannedUserPage, limit: LIMIT_NUMBER }));
  };
  React.useEffect((): void => {
    fetchUsersData();
  }, [currentUserPage, isLoading]);

  React.useEffect((): void => {
    fetchUnconfirmedUsersData();
  }, [currentUnConfirmedUserPage, isLoading]);

  React.useEffect((): void => {
    fetchBannedUsersData();
  }, [currentBannedUserPage, isLoading]);

  const { users, unconfirmedUsers, bannedUsers } = useAppSelector((state) => state.user);
  const { navigate } = useNavigation<NavigationProp<ParamListBase>>();

  const handleClick = (): void => {
    navigate('userCreateEdit');
  };

  const handlePrevUserPage = (): void => {
    if (currentUserPage > 1) {
      setUserCurrentPage((prevPage: number) => prevPage - 1);
    }
  };

  const handleNextUserPage = (): void => {
    const totalUnconfirmedUsers: number = users.total_items;
    if (currentUnConfirmedUserPage * LIMIT_NUMBER < totalUnconfirmedUsers) {
      setUserCurrentPage((prevPage: number) => prevPage + 1);
    }
  };

  const handlePrevUnconfirmedUserPage = (): void => {
    if (currentUnConfirmedUserPage > 1) {
      setUserConfirmedCurrentPage((prevPage: number) => prevPage - 1);
    }
  };

  const handleNextUnconfirmedUserPage = (): void => {
    const totalUnconfirmedUsers: number = unconfirmedUsers.total_items;
    if (currentUnConfirmedUserPage * LIMIT_NUMBER < totalUnconfirmedUsers) {
      setUserConfirmedCurrentPage((prevPage: number) => prevPage + 1);
    }
  };

  const handlePrevBannedUserPage = (): void => {
    if (currentBannedUserPage > 1) {
      setUserBannedCurrentPage((prevPage: number) => prevPage - 1);
    }
  };

  const handleNextBannedUserPage = (): void => {
    const totalBannedUsers: number = unconfirmedUsers.total_items;
    if (currentBannedUserPage * LIMIT_NUMBER < totalBannedUsers) {
      setUserBannedCurrentPage((prevPage: number) => prevPage + 1);
    }
  };

  const handleRefresh = () => {
    fetchUsersData();
    fetchUnconfirmedUsersData();
    fetchBannedUsersData();
  };
  return (
    <Main>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={users.isLoading && unconfirmedUsers.isLoading}
            onRefresh={handleRefresh}
          />
        }>
        <View className="m-4">
          {users.total_items > 0 ? (
            <UserList
              users={users.items}
              label="Հաճախորդներ"
              handlePreviousPage={handlePrevUserPage}
              handleNextPage={handleNextUserPage}
              previousButtonDisable={currentUserPage <= 1}
              nextButtonDisable={currentUserPage * LIMIT_NUMBER >= users.total_items}
              totalItems={users.total_items}
            />
          ) : null}
          {unconfirmedUsers.total_items > 0 ? (
            <UserList
              users={unconfirmedUsers.items}
              label="Գրանցման հայտեր"
              handlePreviousPage={handlePrevUnconfirmedUserPage}
              handleNextPage={handleNextUnconfirmedUserPage}
              previousButtonDisable={currentUnConfirmedUserPage <= 1}
              nextButtonDisable={
                currentUnConfirmedUserPage * LIMIT_NUMBER >= unconfirmedUsers.total_items
              }
              totalItems={unconfirmedUsers.total_items}
            />
          ) : null}
          {bannedUsers.total_items > 0 ? (
            <UserList
              users={bannedUsers.items}
              label="Ապաակտիվացված հաճախորդներ"
              handlePreviousPage={handlePrevBannedUserPage}
              handleNextPage={handleNextBannedUserPage}
              previousButtonDisable={currentBannedUserPage <= 1}
              nextButtonDisable={currentBannedUserPage * LIMIT_NUMBER >= bannedUsers.total_items}
              totalItems={bannedUsers.total_items}
            />
          ) : null}
          <CreateItemButton handleClick={handleClick} createButtonLabel="Ստեղծել հաճախորդ" />
        </View>
      </ScrollView>
    </Main>
  );
};
