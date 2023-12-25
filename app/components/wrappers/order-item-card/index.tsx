import React from 'react';
import { Image, Text, View } from 'react-native';

export interface IOrderItemCard {
  title: string;
  code: number;
  orderCount: number;
  price: number;
}

export const OrderItemCard: React.FC<IOrderItemCard> = (props) => {
  const { title, price, orderCount, code } = props;

  return (
    <View className="flex-row flex-1 min-h-[100px] bg-white shadow rounded-lg">
      <Image
        source={require('./../../../assets/images/products/iphone.png')}
        className="w-24 h-24 rounded-lg"
        alt={title}
      />
      <View className="m-3 flex-1 justify-between">
        <View>
          <Text className="text-blue-600">{title}</Text>
        </View>
        <View>
          <Text className="text-gray-600 mb-1">Կոդ։ {code}</Text>
          <View className="flex-row w-full justify-between">
            <Text className="text-sm text-red-500">{orderCount + ' x ' + price}</Text>
            <Text className="text-sm text-gray-600">{orderCount * price} ․ԴՐ</Text>
          </View>
        </View>
      </View>
    </View>
  );
};