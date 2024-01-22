import React from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { fetchDeliveredOrdersThunk } from '../../../../redux/http/orderThunk';
import { EOrderStatus, TOrder } from '../../../../redux/types/order';
import { formatDate } from '../../../../utils';
import { LIMIT_NUMBER } from '../../../../utils/constants';
import { EmptyOrder, Loading } from '../../../ui';
import { CrudList, Main } from '../../../wrappers';

export const OrdersCompleted = () => {
  const dispatch = useAppDispatch();
  const { ordersHistory, cancelOrder } = useAppSelector((state) => state.order);
  const [currentStatusOrderPage, setStatusOrderCurrentPage] = React.useState<number>(1);
  const isLoading: boolean = cancelOrder.isLoading;
  const fetchData = (): void => {
    dispatch(
      fetchDeliveredOrdersThunk({
        page: currentStatusOrderPage,
        limit: LIMIT_NUMBER,
      })
    );
  };

  React.useEffect((): void => {
    fetchData();
  }, [currentStatusOrderPage, isLoading]);

  const handlePrevUserPage = (): void => {
    if (currentStatusOrderPage > 1) {
      setStatusOrderCurrentPage((prevPage: number) => prevPage - 1);
    }
  };

  const handleNextUserPage = (): void => {
    const totalUnconfirmedUsers: number = ordersHistory.total_items;
    if (currentStatusOrderPage * LIMIT_NUMBER < totalUnconfirmedUsers) {
      setStatusOrderCurrentPage((prevPage: number) => prevPage + 1);
    }
  };

  const handleRefresh = (): void => {
    fetchData();
  };

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
          <View className="m-4">
            <CrudList
              data={ordersHistory.items}
              navigateTo="order-completed-view"
              previousButtonDisable={currentStatusOrderPage <= 1}
              nextButtonDisable={currentStatusOrderPage * LIMIT_NUMBER >= ordersHistory.total_items}
              handlePreviousPage={handlePrevUserPage}
              handleNextPage={handleNextUserPage}
              totalItems={ordersHistory.total_items}
              fieldButtonType="view"
              renderItemComponent={(index: number, item: TOrder) => (
                <>
                  <View className="flex-row items-center gap-2">
                    <Text className="font-semibold">{index + 1}.</Text>
                    <Text
                      className={`min-w-[85px] w-24 ${
                        item.status === EOrderStatus.REJECTED ? 'text-red-800 font-semibold' : ''
                      }`}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {item.author?.firstname + ' ' + item.author?.lastname}
                    </Text>
                  </View>
                  <Text
                    className={`${
                      item.status === EOrderStatus.REJECTED ? 'text-red-800 font-semibold' : ''
                    }`}>
                    {formatDate(
                      item.status === EOrderStatus.DELIVERED
                        ? (item.deliveredTime as string)
                        : (item.rejectedTime as string)
                    )}
                  </Text>
                </>
              )}
            />
          </View>
        </ScrollView>
      )}
    </Main>
  );
};
