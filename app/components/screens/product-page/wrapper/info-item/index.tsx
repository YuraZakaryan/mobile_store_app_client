import React from 'react';
import { Text, View } from 'react-native';

import { formattedPrice } from '../../../../../utils/product';
import { ETypeInfo, IInfoItem } from '../../types';

export const InfoItem: React.FC<IInfoItem> = React.memo((props) => {
  const { label, content, additionalContent, type } = props;

  return (
    <View className="bg-white flex-row items-center justify-between border border-gray-200 p-4 mb-1 rounded-lg overflow-hidden">
      <Text className="text-gray-500">{label}</Text>
      {type === ETypeInfo.PRICE ? (
        <Text className="text-orange-500 font-semibold">
          {formattedPrice(content as number)} ․դր
        </Text>
      ) : type === ETypeInfo.PRICE_WITH_DISCOUNTED && additionalContent ? (
        <View className="flex-row items-center gap-2">
          <Text className="text-orange-500 font-semibold">{formattedPrice(content as number)}</Text>
          <Text className="text-gray-600 line-through">
            {formattedPrice(additionalContent as number)}
          </Text>
          <Text className="text-orange-500 font-semibold">․դր</Text>
        </View>
      ) : type === ETypeInfo.LONG ? (
        <Text className="text-orange-500 font-semibold w-3/4 text-right">{content}</Text>
      ) : (
        <Text className="text-orange-500 font-semibold">{content}</Text>
      )}
    </View>
  );
});
InfoItem.displayName = 'InfoItem';
