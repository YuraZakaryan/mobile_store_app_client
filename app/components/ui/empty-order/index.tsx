import React from 'react';
import { Image, Text, View } from 'react-native';

import { IEmptyOrder } from '../../../types';

export const EmptyOrder: React.FC<IEmptyOrder> = ({ text, className }) => {
  return (
    <View className={`w-full h-full justify-center items-center ${className ? className : ''}`}>
      <View className="items-center justify-center">
        <Image
          source={require('./../../../assets/images/products/empty-cart.png')}
          alt="empty cart"
          className="w-64 h-64"
        />
        <Text className="text-orange-500 text-center font-bold text-2xl">{text}</Text>
      </View>
    </View>
  );
};
