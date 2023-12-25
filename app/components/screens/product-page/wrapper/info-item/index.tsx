import React from 'react';
import { Text, View } from 'react-native';

import { ETypeInfo, IInfoItem } from '../../types';

export const InfoItem: React.FC<IInfoItem> = React.memo((props) => {
  const { label, content, type } = props;
  return (
    <View className="bg-white flex-row items-center justify-between border border-gray-200 p-4 mb-1 rounded-lg">
      <Text className="text-gray-500">{label}</Text>
      <Text className="text-orange-500 font-semibold">
        {type === ETypeInfo.PRICE ? `${content} ․դր` : content}
      </Text>
    </View>
  );
});
InfoItem.displayName = 'InfoItem';
