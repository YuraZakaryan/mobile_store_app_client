import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { ICON_MAIN_COLOR } from '../../../utils/constants';

export interface IScrollLoader {
  size?: number;
}

export const ScrollLoader: React.FC<IScrollLoader> = ({ size }) => {
  return (
    <View className="items-center py-2">
      <ActivityIndicator size={size || 55} color={ICON_MAIN_COLOR} />
    </View>
  );
};
