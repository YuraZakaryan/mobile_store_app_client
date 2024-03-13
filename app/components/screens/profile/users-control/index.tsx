import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import React from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';

import { UserList } from './wrappers/user-list';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { useDebounce } from '../../../../hooks/useDebounce';
import {
  fetchBannedUsers,
  fetchUnconfirmedUsers,
  fetchUsersThunk,
} from '../../../../redux/http/userThunk';
import { LIMIT_NUMBER } from '../../../../utils/constants';
import { Loading } from '../../../ui';
import { CreateItemButton, Main } from '../../../wrappers';

export const UsersControl = () => {
  const dispatch = useAppDispatch();
  const { createUser, updateUser, cancelUser, banUser } = useAppSelector((state) => state.user);
  const { users, unconfirmedUsers, bannedUsers } = useAppSelector((state) => state.user);
  const { navigate } = useNavigation<NavigationProp<ParamListBase>>();
  const [currentUserPage, setUserCurrentPage] = React.useState<number>(1);
  const [currentUnConfirmedUserPage, setUserConfirmedCurrentPage] = React.useState<number>(1);
  const [currentBannedUserPage, setUserBannedCurrentPage] = React.useState<number>(1);
  const [searchUserQuery, setSearchUserQuery] = React.useState<string>('');
  const [searchUnConfirmedUserQuery, setSearchUnConfirmedUserQuery] = React.useState<string>('');
  const [searchBannedUserQuery, setSearchBannedUserQuery] = React.useState<string>('');
  const [hasSearchedUser, setHasSearchedUser] = React.useState<boolean>(false);
  const [hasSearchedUnConfirmedUser, setHasSearchedUnConfirmedUser] =
    React.useState<boolean>(false);
  const [hasSearchedBannedUser, setHasSearchedBannedUser] = React.useState<boolean>(false);

  const debouncedSearchUser: string = useDebounce(searchUserQuery, 500);
  const debouncedSearchUnConfirmedUser: string = useDebounce(searchUnConfirmedUserQuery, 500);
  const debouncedSearchBannedUser: string = useDebounce(searchBannedUserQuery, 500);

  const isLoading: boolean | null =
    createUser.isLoading || updateUser.isLoading || cancelUser.isLoading || banUser.isLoading;

  const fetchSearchUserData = (): void => {
    dispatch(fetchUsersThunk({ page: 0, limit: LIMIT_NUMBER, query: debouncedSearchUser }));
  };
  const fetchUsersData = (): void => {
    dispatch(
      fetchUsersThunk({ page: currentUserPage, limit: LIMIT_NUMBER, query: searchUserQuery })
    );
  };

  const fetchUnconfirmedSearchUserData = (): void => {
    dispatch(
      fetchUnconfirmedUsers({ page: 0, limit: LIMIT_NUMBER, query: debouncedSearchUnConfirmedUser })
    );
  };
  const fetchUnconfirmedUsersData = (): void => {
    dispatch(
      fetchUnconfirmedUsers({
        page: currentUnConfirmedUserPage,
        limit: LIMIT_NUMBER,
        query: searchUnConfirmedUserQuery,
      })
    );
  };

  const fetchBannedSearchUserData = (): void => {
    dispatch(fetchBannedUsers({ page: 0, limit: LIMIT_NUMBER, query: debouncedSearchBannedUser }));
  };
  const fetchBannedUsersData = (): void => {
    dispatch(
      fetchBannedUsers({
        page: currentBannedUserPage,
        limit: LIMIT_NUMBER,
        query: searchBannedUserQuery,
      })
    );
  };
  React.useEffect((): void => {
    fetchSearchUserData();
  }, [debouncedSearchUser]);

  React.useEffect((): void => {
    fetchUsersData();
  }, [currentUserPage, isLoading]);

  React.useEffect((): void => {
    fetchUnconfirmedSearchUserData();
  }, [debouncedSearchUnConfirmedUser]);

  React.useEffect((): void => {
    fetchUnconfirmedUsersData();
  }, [currentUnConfirmedUserPage, isLoading]);

  React.useEffect((): void => {
    fetchBannedSearchUserData();
  }, [debouncedSearchBannedUser]);

  React.useEffect((): void => {
    fetchBannedUsersData();
  }, [currentBannedUserPage, isLoading]);

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

  const handleRefresh = (): void => {
    fetchUsersData();
    fetchUnconfirmedUsersData();
    fetchBannedUsersData();
  };

  return (users.isLoading && !hasSearchedUser) ||
    (unconfirmedUsers.isLoading && !hasSearchedUnConfirmedUser) ||
    (bannedUsers.isLoading && !hasSearchedBannedUser) ? (
    <Loading />
  ) : (
    <Main>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={(users.isLoading && unconfirmedUsers.isLoading) as boolean}
            onRefresh={handleRefresh}
          />
        }
        keyboardShouldPersistTaps="handled">
        <View className="m-4">
          {users.total_items > 0 || hasSearchedUser ? (
            <UserList
              users={users.items}
              label="Հաճախորդներ"
              handlePreviousPage={handlePrevUserPage}
              handleNextPage={handleNextUserPage}
              previousButtonDisable={currentUserPage <= 1}
              nextButtonDisable={currentUserPage * LIMIT_NUMBER >= users.total_items}
              totalItems={users.total_items}
              searchQuery={searchUserQuery}
              setSearchQuery={setSearchUserQuery}
              hasSearched={hasSearchedUser}
              setHasSearched={setHasSearchedUser}
            />
          ) : null}
          {unconfirmedUsers.total_items > 0 || hasSearchedUnConfirmedUser ? (
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
              searchQuery={searchUnConfirmedUserQuery}
              setSearchQuery={setSearchUnConfirmedUserQuery}
              hasSearched={hasSearchedUnConfirmedUser}
              setHasSearched={setHasSearchedUnConfirmedUser}
            />
          ) : null}
          {bannedUsers.total_items > 0 || hasSearchedBannedUser ? (
            <UserList
              users={bannedUsers.items}
              label="Ապաակտիվացված հաճախորդներ"
              handlePreviousPage={handlePrevBannedUserPage}
              handleNextPage={handleNextBannedUserPage}
              previousButtonDisable={currentBannedUserPage <= 1}
              nextButtonDisable={currentBannedUserPage * LIMIT_NUMBER >= bannedUsers.total_items}
              totalItems={bannedUsers.total_items}
              searchQuery={searchBannedUserQuery}
              setSearchQuery={setSearchBannedUserQuery}
              hasSearched={hasSearchedBannedUser}
              setHasSearched={setHasSearchedBannedUser}
            />
          ) : null}
          <CreateItemButton handleClick={handleClick} createButtonLabel="Ստեղծել հաճախորդ" />
        </View>
      </ScrollView>
    </Main>
  );
};
