import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { useAppSelector } from '../../../../hooks/redux';
import { IOrder } from '../../../../redux/types';
import { CrudList, Main } from '../../../wrappers';

export const OrdersControl = () => {
  const { orders } = useAppSelector((state) => state.basket);

  return (
    <Main>
      <ScrollView>
        <View className="m-4">
          <CrudList
            data={orders}
            navigateTo="order-view"
            fieldButtonType="view"
            renderItemComponent={(index: number, item: IOrder) => (
              <>
                <View className="flex-row items-center gap-2">
                  <Text className="font-semibold">{index + 1}.</Text>
                  <Text className="min-w-[85px] w-36" numberOfLines={1} ellipsizeMode="tail">
                    {item.user.firstname + ' ' + item.user.lastname}
                  </Text>
                </View>
                <Text>{item.items.length}</Text>
              </>
            )}
          />
        </View>
      </ScrollView>
    </Main>
  );
};
