import React from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';

import { TOrder, TOrderItem } from '../../../redux/types/order';
import { IOrderList } from '../../../types';
import { calculateDiscountedPrice, formattedPrice } from '../../../utils/product';
import { OrderInfo } from '../order-info';
import { OrderItemCard } from '../order-item-card';

export const OrdersList: React.FC<IOrderList> = React.memo((props) => {
  const { children, item } = props;

  const totalAmount = item?.items.reduce((acc, item) => {
    if (item.product && item.product.price) {
      const itemPrice = item.product.discount
        ? calculateDiscountedPrice(item.product.price, item.product.discount)
        : item.product.price;
      return acc + item.itemCount * itemPrice;
    }
    return acc;
  }, 0);

  return (
    <ScrollView>
      <View className="w-full p-4 gap-6">
        <View className="w-full">
          <FlatList
            data={item?.items}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={({ item }) => (
              <>
                {item.product ? (
                  <OrderItemCard
                    orderCount={item.itemCount}
                    price={item.product.price}
                    code={item.product.code}
                    title={item.product.title}
                    discount={item.product.discount}
                  />
                ) : (
                  <View className="bg-white p-2 rounded-lg">
                    <Text className="text-xl text-gray-500">Ապրանքները ջնջվել է</Text>
                  </View>
                )}
              </>
            )}
            horizontal={false}
            keyExtractor={(item: TOrderItem) => item._id}
          />
        </View>
        <View className="bg-white flex-row justify-between p-4 items-center w-full rounded-lg">
          <Text className="text-lg text-gray-400">Ընդհանուր</Text>
          <Text>{formattedPrice(totalAmount as number)} ․դր</Text>
        </View>
        <View className="w-full">
          <OrderInfo item={item as TOrder} totalAmount={totalAmount as number} />
        </View>
        {children}
      </View>
    </ScrollView>
  );
});
OrdersList.displayName = 'OrdersList';
