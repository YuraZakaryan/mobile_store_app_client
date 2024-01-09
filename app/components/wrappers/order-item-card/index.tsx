import React from 'react';
import { Image, Text, View } from 'react-native';

import { calculateDiscountedPrice, formattedPrice } from '../../../utils/product';

export interface IOrderItemCard {
  title: string;
  code: string;
  orderCount: number;
  price: number;
  discount?: number;
}

export const OrderItemCard: React.FC<IOrderItemCard> = (props) => {
  const { title, price, orderCount, code, discount } = props;

  return (
    <View className="flex-row flex-1 min-h-[100px] bg-white shadow rounded-lg">
      <Image
        source={require('./../../../assets/images/products/iphone.png')}
        className="w-24 h-24 rounded-lg"
        alt={title}
      />
      <View className="m-3 flex-1 justify-between">
        <View>
          <Text className="text-blue-600 font-semibold">{title}</Text>
        </View>
        <View>
          <Text className="text-gray-600 mb-1">Կոդ։ {code}</Text>
          <View className="flex-row w-full justify-between">
            <View className="flex-row items-center gap-1">
              <Text className="text-sm text-red-500">{orderCount}</Text>
              <Text className="text-sm text-red-500">x</Text>
              <Text
                className={`text-sm text-red-500 ${discount ? 'line-through text-gray-600' : ''}`}>
                {formattedPrice(price)}
              </Text>
              {discount ? (
                <Text className="text-sm text-red-500">
                  {formattedPrice(calculateDiscountedPrice(price, discount))}
                </Text>
              ) : null}
            </View>
            <Text className="text-sm text-gray-600">
              {formattedPrice(
                orderCount * (discount ? calculateDiscountedPrice(price, discount) : price)
              )}
              ․ԴՐ
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
