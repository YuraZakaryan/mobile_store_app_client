import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { ICON_MAIN_COLOR } from '../../../utils/constants';

export const Loading = () => {
  return (
    <View className="h-full w-full justify-center items-center z-50">
      <ActivityIndicator size={55} color={ICON_MAIN_COLOR} />
    </View>
  );
};
