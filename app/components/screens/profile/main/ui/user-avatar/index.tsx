import React from 'react';
import { Image, View } from 'react-native';

export const UserAvatar = () => {
  return (
    <View className="overflow-hidden rounded-full flex-1 flex-col">
      <Image
        source={require('./../../../../../../assets/images/avatars/avatar_default.png')}
        className="w-24 h-24"
      />
    </View>
  );
};
