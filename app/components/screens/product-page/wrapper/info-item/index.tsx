import React from 'react';
import { Text, View } from 'react-native';

import { calculateDiscountedPrice, formattedPrice } from '../../../../../utils/product';
import { ETypeInfo, IInfoItem } from '../../types';

export const InfoItem: React.FC<IInfoItem> = React.memo((props) => {
  const { label, content, type, discount } = props;
  return (
    <View className="bg-white flex-row items-center justify-between border border-gray-200 p-4 mb-1 rounded-lg">
      <Text className="text-gray-500">{label}</Text>
      {type === ETypeInfo.PRICE ? (
        <Text className="text-orange-500 font-semibold">
          {formattedPrice(content as number)} ․դր
        </Text>
      ) : type === ETypeInfo.PRICE_WITH_DISCOUNTED ? (
        <View className="flex-row items-center gap-2">
          <Text className="text-orange-500 font-semibold">
            {formattedPrice(calculateDiscountedPrice(content as number, discount as number))}
          </Text>
          <Text className="text-gray-600 line-through">{formattedPrice(content as number)}</Text>
          <Text className="text-orange-500 font-semibold">․դր</Text>
        </View>
      ) : (
        <Text className="text-orange-500 font-semibold">{content}</Text>
      )}
    </View>
  );
});
InfoItem.displayName = 'InfoItem';
