import React from 'react';
import { FlatList, RefreshControl, ScrollView, Text, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { fetchOrdersByAuthorThunk } from '../../../redux/http/orderThunk';
import { EOrderStatus, TOrder, TOrderItem } from '../../../redux/types/order';
import { formatDate, groupedHistory } from '../../../utils';
import { LIMIT_NUMBER } from '../../../utils/constants';
import { calculateDiscountedPrice, formattedPrice, getOrderStatus } from '../../../utils/product';
import { EmptyOrder, Loading } from '../../ui';
import { Main, OrderItemCard, PaginationButtons } from '../../wrappers';

export const LastOrders = () => {
  const dispatch = useAppDispatch();

  // Retrieve orders history and 'toOrder' state from the Redux store
  const { ordersHistory, toOrder } = useAppSelector((state) => state.order);

  // Retrieve user information from the Redux store
  const { user } = useAppSelector((state) => state.user);

  // State to track the current page for fetching orders
  const [currentLastOrderPage, setLastOrderCurrentPage] = React.useState<number>(1);

  // Loading status based on 'toOrder' action
  const isLoading = toOrder.isLoading;

  // Function to fetch orders by author with pagination
  const fetchData = (): void => {
    dispatch(
      fetchOrdersByAuthorThunk({
        authorId: user?._id as string,
        page: currentLastOrderPage,
        limit: LIMIT_NUMBER,
      })
    );
  };

  // Fetch data on component mount, page change, or loading state change
  React.useEffect(() => {
    fetchData();
  }, [currentLastOrderPage, isLoading]);

  // Function to handle moving to the previous page of orders
  const handlePrevLastOrderPage = (): void => {
    if (currentLastOrderPage > 1) {
      setLastOrderCurrentPage((prevPage: number) => prevPage - 1);
    }
  };

  // Function to handle moving to the next page of orders
  const handleNextLastOrderPage = (): void => {
    const totalUnconfirmedUsers: number = ordersHistory.total_items;
    if (currentLastOrderPage * LIMIT_NUMBER < totalUnconfirmedUsers) {
      setLastOrderCurrentPage((prevPage: number) => prevPage + 1);
    }
  };

  const handleRefresh = (): void => {
    fetchData();
  };

  // Determine button disable status based on current page and total items
  const previousButtonDisable = currentLastOrderPage <= 1;
  const nextButtonDisable = currentLastOrderPage * LIMIT_NUMBER >= ordersHistory.total_items;

  // Group orders history items by a certain criteria (assuming 'groupedHistory' is a function)
  const groupedProducts = groupedHistory(ordersHistory.items);

  return ordersHistory.isLoading ? (
    <Loading />
  ) : (
    <Main>
      {!Array.isArray(ordersHistory.items) || ordersHistory.items.length === 0 ? (
        <EmptyOrder text="Պատվերների պատմությունը առկա չէ" />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={ordersHistory.isLoading} onRefresh={handleRefresh} />
          }>
          {Object.entries(groupedProducts).map(([dateTime, orders]) => {
            return (
              <View key={dateTime} className="p-5">
                <Text className="text-lg font-bold mb-2 text-blue-500">{formatDate(dateTime)}</Text>
                {orders.map((order: TOrder, index: number) => {
                  const totalAmount: number = order.items.reduce(
                    (acc: number, item: TOrderItem) =>
                      acc +
                      item.itemCount *
                        (item.product.discount
                          ? calculateDiscountedPrice(item.product.price, item.product.discount)
                          : item.product.price),
                    0
                  );
                  return (
                    <React.Fragment key={index}>
                      <FlatList
                        key={index}
                        scrollEnabled={false}
                        data={order.items}
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                        renderItem={({ item }) => <OrderItemCard item={item} />}
                        keyExtractor={(item: TOrderItem) => item._id}
                      />
                      <View className="w-full p-2 flex-row justify-between items-center">
                        <Text
                          className={`font-bold ${
                            order.status === EOrderStatus.ORDERED
                              ? 'text-blue-400'
                              : order.status === EOrderStatus.ACCEPTED
                                ? 'text-orange-500'
                                : order.status === EOrderStatus.DELIVERED
                                  ? 'text-green-600'
                                  : order.status === EOrderStatus.REJECTED
                                    ? 'text-red-600'
                                    : 'text-gray-400'
                          }`}>
                          {getOrderStatus(order.status)}
                        </Text>
                        <Text className="font-bold text-red-500">
                          Ընդհանուր: {formattedPrice(totalAmount)} ․ԴՐ
                        </Text>
                      </View>
                    </React.Fragment>
                  );
                })}
              </View>
            );
          })}
          <PaginationButtons
            total_items={ordersHistory.total_items}
            previousButtonDisable={previousButtonDisable}
            nextButtonDisable={nextButtonDisable}
            handlePrevPage={handlePrevLastOrderPage}
            handleNextPage={handleNextLastOrderPage}
          />
        </ScrollView>
      )}
    </Main>
  );
};
