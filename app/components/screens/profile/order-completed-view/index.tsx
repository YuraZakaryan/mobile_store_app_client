import { useRoute } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';

import { TOrder } from '../../../../redux/types/order';
import { Main, OrdersList } from '../../../wrappers';
import { TOrderViewRouteParams } from '../order-view/types';

export const OrderCompletedView = () => {
  const route = useRoute();
  const { item }: TOrderViewRouteParams = (route.params as TOrderViewRouteParams) || {};

  return (
    <Main>
      <OrdersList item={item as TOrder}>
        <View className="bg-white items-center w-full rounded-lg">
          <View className="p-3">
            <Text className="text-red-500 text-center font-bold text-xl">Մերժված է</Text>
          </View>
        </View>
      </OrdersList>
    </Main>
  );
};
