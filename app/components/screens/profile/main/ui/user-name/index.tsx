import React from 'react';
import { Text, View } from 'react-native';

import { useAppSelector } from '../../../../../../hooks/redux';
import { TUser } from '../../../../../../redux/types';
import { isAdmin } from '../../../../../../utils';

export const UserName: React.FC = () => {
  const { user, isAuth } = useAppSelector((state) => state.user);

  const { firstname, lastname } = user as TUser;
  return (
    user &&
    isAuth && (
      <View className="mt-2 items-center">
        {isAdmin(user.role) ? (
          <Text className="text-red-700 text-base font-semibold">Ադմինիստրատոր</Text>
        ) : null}
        <Text className="text-xl font-bold text-blue-700">{`${firstname} ${lastname}`}</Text>
      </View>
    )
  );
};
