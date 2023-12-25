import React from 'react';
import { Text, View } from 'react-native';

import { useAppSelector } from '../../../../../../hooks/redux';
import { isAdmin } from '../../../../../../utils/user';

export const UserName: React.FC = () => {
  const { user } = useAppSelector((state) => state.user);

  const { firstname, lastname } = user;
  return (
    <View className="mt-2 items-center">
      {isAdmin(user.role) ? (
        <Text className="text-red-700 text-base font-semibold">Ադմինիստրատոր</Text>
      ) : null}
      <Text className="text-xl font-bold text-blue-700">{`${firstname} ${lastname}`}</Text>
    </View>
  );
};
