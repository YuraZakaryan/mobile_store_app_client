import React from 'react';
import { Image, Text, View } from 'react-native';

import { ISaleIcon } from '../../../types';

export const SaleIcon: React.FC<ISaleIcon> = React.memo(({ discount }) => {
  return (
    <View className="top-0 right-1 absolute rotate-12">
      <View className="relative justify-center items-center">
        <Image
          source={require('./../../../assets/images/products/sale.png')}
          alt="sale"
          className="w-14 h-14"
        />
        <View className="absolute text-white">
          <Text className="text-white text-[10px]">Զեղչ</Text>
          <Text className="text-orange-500 font-bold text-[12px]">{discount} %</Text>
        </View>
      </View>
    </View>
  );
});
SaleIcon.displayName = 'SaleIcon';
