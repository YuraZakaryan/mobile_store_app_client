import React from 'react';
import { Image, Text, View } from 'react-native';

import { useAppSelector } from '../../../hooks/redux';
import { usePriceType } from '../../../hooks/userPriceType';
import { EPriceType } from '../../../redux/types';
import { TOrderItem } from '../../../redux/types/order';
import { API_URL } from '../../../utils/constants';
import { formattedPrice, isDiscount } from '../../../utils/product';

export interface IOrderItemCard {
  item: TOrderItem;
}

export const OrderItemCard: React.FC<IOrderItemCard> = React.memo((props) => {
  const { item } = props;

  const { user } = useAppSelector((state) => state.user);

  const { priceKey } = usePriceType(user?.priceType as EPriceType);

  if (!item.product) {
    return null;
  }

  const picture: string = item.product.picture;
  const checkDiscount = isDiscount(user?.discountPercent as number);

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
                className={`text-sm text-red-500 ${checkDiscount ? 'line-through text-gray-600' : ''}`}>
                {formattedPrice(item.product[priceKey])}
              </Text>
              {checkDiscount ? (
                <Text className="text-sm text-red-500">{formattedPrice(item.product.price)}</Text>
              ) : null}
            </View>
            <Text className="text-sm text-gray-600">
              {formattedPrice(item.itemCount * item.product.price)}
              ․ԴՐ
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
});
OrderItemCard.displayName = 'OrderItemCard';
