import { useRoute } from '@react-navigation/native';
import React from 'react';
import { FlatList, Image, ScrollView, Text, View } from 'react-native';

import { TOrderViewRouteParams } from './types';
import { ButtonStatusViewOrder } from './wrappers';
import { IBasketItem, IOrder } from '../../../../redux/types';
import { Main, OrderItemCard } from '../../../wrappers';
import { OrderInfo } from '../../../wrappers/order-info';

export const OrderView = () => {
  const route = useRoute();
  const { item }: TOrderViewRouteParams = (route.params as TOrderViewRouteParams) || {};
  const totalAmount = item?.items.reduce((acc, item) => acc + item.orderCount * item.price, 0);
  const formattedTotalAmount = totalAmount?.toLocaleString('en-US');

  return (
    <Main>
      <ScrollView>
        <View className="w-full p-4 gap-6">
          <View className="w-full">
            <FlatList
              data={item?.items}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              renderItem={({ item }) => (
                <OrderItemCard
                  orderCount={item.orderCount}
                  price={item.price}
                  code={item.code}
                  title={item.title}
                />
              )}
              horizontal={false}
              keyExtractor={(item: IBasketItem) => item._id}
            />
          </View>
          <View className="bg-white flex-row justify-between p-4 items-center w-full rounded-lg">
            <Text className="text-lg text-gray-400">Ընդհանուր</Text>
            <Text>{formattedTotalAmount} ․դր</Text>
          </View>
          <View className="w-full">
            <OrderInfo item={item as IOrder} />
          </View>
          <View className="bg-white items-center w-full rounded-lg">
            <ButtonStatusViewOrder label="Պատվիրաված" />
            <ButtonStatusViewOrder label="Ընդունված" />
            <ButtonStatusViewOrder label="Առաքված" />
          </View>
        </View>
      </ScrollView>
    </Main>
  );
};
