import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { useAppSelector } from '../../../hooks/redux';
import { IOrder } from '../../../redux/types';
import { formatDate } from '../../../utils';
import { CrudList, Main } from '../../wrappers';

export const OrdersCompleted = () => {
  const { orders } = useAppSelector((state) => state.basket);
  const completedOrders = orders.filter((item) => item.status === 'completed');

  return (
    <Main>
      <ScrollView>
        <View className="m-4">
          <CrudList
            data={completedOrders}
            navigateTo="order-completed-view"
            fieldButtonType="view"
            renderItemComponent={(index: number, item: IOrder) => (
              <>
                <View className="flex-row items-center gap-2">
                  <Text className="font-semibold">{index + 1}.</Text>
                  <Text className="min-w-[85px] w-24" numberOfLines={1} ellipsizeMode="tail">
                    {item.user.firstname}
                  </Text>
                </View>
                <Text>{formatDate(item.orderCompletedTime)}</Text>
              </>
            )}
          />
        </View>
      </ScrollView>
    </Main>
  );
};
