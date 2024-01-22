import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Image, View } from 'react-native';

import { useAppSelector } from '../../../../../../hooks/redux';

export const UserAvatar = () => {
  const { user } = useAppSelector((state) => state.user);
  return (
    <View className="overflow-hidden flex-1 flex-col relative">
      <View className="absolute z-50 right-1 top-1">
        {user && (
          <AntDesign
            name={!user.banned && user.confirmed ? 'checkcircle' : 'minuscircle'}
            size={24}
            color={!user.banned && user.confirmed ? 'green' : 'red'}
          />
        )}
      </View>
      <Image
        source={require('./../../../../../../assets/images/avatars/avatar_default.png')}
        className="w-24 h-24"
      />
    </View>
  );
};
