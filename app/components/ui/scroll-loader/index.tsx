import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { ICON_MAIN_COLOR } from '../../../utils/constants';

export const ScrollLoader = () => {
  return (
    <View className="items-center py-2">
      <ActivityIndicator size={55} color={ICON_MAIN_COLOR} />
    </View>
  );
};
