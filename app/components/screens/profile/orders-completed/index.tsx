import React from 'react';
import { ScrollView, Text, View, RefreshControl } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { fetchDeliveredOrdersThunk } from '../../../../redux/http/orderThunk';
import { TOrder } from '../../../../redux/types/order';
import { formatDate } from '../../../../utils';
import { LIMIT_NUMBER } from '../../../../utils/constants';
import { EmptyOrder, Loading } from '../../../ui';
import { CrudList, Main } from '../../../wrappers';

export const OrdersCompleted = () => {
  const dispatch = useAppDispatch();
  const { ordersHistory } = useAppSelector((state) => state.order);
  const [currentStatusOrderPage, setStatusOrderCurrentPage] = React.useState<number>(1);

  const fetchData = () => {
    dispatch(
      fetchDeliveredOrdersThunk({
        page: currentStatusOrderPage,
        limit: LIMIT_NUMBER,
      })
    );
  };

  React.useEffect(() => {
    fetchData();
  }, [currentStatusOrderPage]);

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

  const handleRefresh = () => {
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
                    <Text className="min-w-[85px] w-24" numberOfLines={1} ellipsizeMode="tail">
                      {item.author?.firstname + ' ' + item.author?.lastname}
                    </Text>
                  </View>
                  <Text>{formatDate(item.deliveredTime as string)}</Text>
                </>
              )}
            />
          </View>
        </ScrollView>
      )}
    </Main>
  );
};
