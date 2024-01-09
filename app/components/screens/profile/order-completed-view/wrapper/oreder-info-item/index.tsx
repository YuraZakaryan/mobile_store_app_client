import React from 'react';
import { Text, View } from 'react-native';

import { IOrderInfoItem } from '../../types';

export const OrderInfoItem: React.FC<IOrderInfoItem> = React.memo((props) => {
  const { label, text, textClassName } = props;

  return (
    <View className="bg-white flex-row mb-2 justify-between p-4 items-center w-full rounded-lg">
      <Text className="text-gray-400">{label}</Text>
      <Text className={`${textClassName ? textClassName : ''}`}>{text}</Text>
    </View>
  );
});
OrderInfoItem.displayName = 'InfoItem';
