import React from 'react';
import { Image, Text, View } from 'react-native';

import { TOrderItem } from '../../../redux/types/order';
import { API_URL } from '../../../utils/constants';
import { calculateDiscountedPrice, formattedPrice } from '../../../utils/product';

export interface IOrderItemCard {
  item: TOrderItem;
}

export const OrderItemCard: React.FC<IOrderItemCard> = React.memo((props) => {
  const { item } = props;

  if (!item.product) {
    return null;
  }

  const picture: string = item.product.picture;

  return (
    <View className="flex-row flex-1 min-h-[100px] bg-white shadow rounded-lg">
      <Image
        source={
          picture
            ? {
                uri: (picture && `${API_URL}/${picture}`) ?? false,
              }
            : require('./../../../assets/images/no_image.jpg')
        }
        alt={item._id}
        className="w-24 h-24 rounded-lg mx-2"
      />
      <View className="m-3 flex-1 justify-between">
        <View>
          <Text className="text-blue-600 font-semibold">{item.product.title}</Text>
        </View>
        <View>
          <Text className="text-gray-600 mb-1">Կոդ։ {item.product.code}</Text>
          <View className="flex-row w-full justify-between">
            <View className="flex-row items-center gap-1">
              <Text className="text-sm text-red-500">{item.itemCount}</Text>
              <Text className="text-sm text-red-500">x</Text>
              <Text
                className={`text-sm text-red-500 ${item.product.discount ? 'line-through text-gray-600' : ''}`}>
                {formattedPrice(item.product.priceWholesale)}
              </Text>
              {item.product.discount ? (
                <Text className="text-sm text-red-500">
                  {formattedPrice(
                    calculateDiscountedPrice(item.product.priceWholesale, item.product.discount)
                  )}
                </Text>
              ) : null}
            </View>
            <Text className="text-sm text-gray-600">
              {formattedPrice(
                item.itemCount *
                  (item.product.discount
                    ? calculateDiscountedPrice(item.product.priceWholesale, item.product.discount)
                    : item.product.priceWholesale)
              )}
              ․ԴՐ
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
});
OrderItemCard.displayName = 'OrderItemCard';
