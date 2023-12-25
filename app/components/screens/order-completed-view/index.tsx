import { useRoute } from '@react-navigation/native';
import React from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';

import { OrderInfoItem } from './wrapper/oreder-info-item';
import { EPacking, IBasketItem, IOrder } from '../../../redux/types';
import { formatDate } from '../../../utils';
import { Main, OrderItemCard } from '../../wrappers';
import { OrderInfo } from '../../wrappers/order-info';
import { TOrderViewRouteParams } from '../profile/order-view/types';
import { ButtonStatusViewOrder } from '../profile/order-view/wrappers';

export const OrderCompletedView = () => {
  const route = useRoute();
  const { item }: TOrderViewRouteParams = (route.params as TOrderViewRouteParams) || {};

  return (
    <Main>
      <ScrollView>
        <View className="p-4 gap-4 w-full">
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
          <View className="w-full">
            <OrderInfo item={item as IOrder} />
          </View>
          <View className="bg-white items-center w-full rounded-lg">
            <ButtonStatusViewOrder label="Չեղարկել" />
          </View>
        </View>
      </ScrollView>
    </Main>
  );
};
