import React from 'react';
import { FlatList, SafeAreaView, ScrollView, Text, View } from 'react-native';

import { useAppSelector } from '../../../hooks/redux';
import { IProductHistory } from '../../../redux/types';
import { formatDate, groupedHistory } from '../../../utils';
import { OrderItemCard } from '../../wrappers';

export const LastOrders = () => {
  const { history } = useAppSelector((state) => state.product);
  const sortedHistory = [...history].sort((a, b) =>
    (a.created_at || '').localeCompare(b.created_at || '')
  );
  const groupedProducts = groupedHistory(sortedHistory);

  return (
    <SafeAreaView>
      <ScrollView>
        {Object.entries(groupedProducts).map(([dateTime, orders]) => {
          const totalCost = orders.reduce((acc, item) => acc + item.orderCount * item.price, 0);

          return (
            <View key={dateTime} className="p-5">
              <Text className="text-lg font-bold mb-2 text-blue-500">{formatDate(dateTime)}</Text>
              <FlatList
                scrollEnabled={false}
                data={orders}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                renderItem={({ item }) => (
                  <OrderItemCard
                    orderCount={item.orderCount}
                    price={item.price}
                    code={item.code}
                    title={item.title}
                  />
                )}
                keyExtractor={(item: IProductHistory) => item._id}
              />
              <Text className="font-bold mt-2 text-red-500 self-end">
                Ընդհանուր: {totalCost} ․ԴՐ
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};
