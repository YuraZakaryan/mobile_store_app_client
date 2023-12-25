import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, View } from 'react-native';

import { UserList } from './wrappers/user-list';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { fetchUnconfirmedUsers, fetchUsersThunk } from '../../../../redux/http/userThunk';
import { LIMIT_NUMBER } from '../../../../utils/constants';
import { CreateItemButton, Main } from '../../../wrappers';

export const UsersControl = () => {
  const dispatch = useAppDispatch();
  const [currentUserPage, setUserCurrentPage] = React.useState<number>(1);
  const [currentUnConfirmedUserPage, setUserConfirmedCurrentPage] = React.useState<number>(1);

  React.useEffect((): void => {
    dispatch(fetchUsersThunk({ page: currentUserPage, limit: LIMIT_NUMBER }));
  }, [currentUserPage]);

  React.useEffect((): void => {
    dispatch(fetchUnconfirmedUsers({ page: currentUnConfirmedUserPage, limit: LIMIT_NUMBER }));
  }, [currentUnConfirmedUserPage]);

  const { users, unconfirmedUsers } = useAppSelector((state) => state.user);
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

  return (
    <Main>
      <ScrollView>
        <View className="m-4">
          {users.total_items > 0 ? (
            <UserList
              users={users.items}
              label="Հաճախորդներ"
              handlePreviousPage={handlePrevUserPage}
              handleNextPage={handleNextUserPage}
              previousButtonDisable={currentUserPage <= 1}
              nextButtonDisable={currentUnConfirmedUserPage * LIMIT_NUMBER >= users.total_items}
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

          <CreateItemButton handleClick={handleClick} createButtonLabel="Ստեղծել հաճախորդ" />
        </View>
      </ScrollView>
    </Main>
  );
};
