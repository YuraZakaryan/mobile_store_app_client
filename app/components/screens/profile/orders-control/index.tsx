import React from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { fetchAllOrdersThunk } from '../../../../redux/http/orderThunk';
import { TOrder } from '../../../../redux/types/order';
import { LIMIT_NUMBER } from '../../../../utils/constants';
import { EmptyOrder, Loading } from '../../../ui';
import { CrudList, Main } from '../../../wrappers';

export const OrdersControl = () => {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.order);
  const [currentOrderPage, setOrderCurrentPage] = React.useState<number>(1);

  const fetchData = () => {
    dispatch(fetchAllOrdersThunk({ page: currentOrderPage, limit: LIMIT_NUMBER }));
  };

  React.useEffect(() => {
    fetchData();
  }, [currentOrderPage]);

  const handlePrevUserPage = (): void => {
    if (currentOrderPage > 1) {
      setOrderCurrentPage((prevPage: number) => prevPage - 1);
    }
  };
  const handleNextUserPage = (): void => {
    const totalOrders: number = orders.total_items;
    if (currentOrderPage * LIMIT_NUMBER < totalOrders) {
      setOrderCurrentPage((prevPage: number) => prevPage + 1);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  return orders.isLoading ? (
    <Loading />
  ) : (
    <Main>
      {!Array.isArray(orders.items) || orders.items.length === 0 ? (
        <EmptyOrder text="Պատվերներ դեռ չկան" />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={orders.isLoading} onRefresh={handleRefresh} />
          }>
          <View className="m-4">
            <View />
            <CrudList
              data={orders.items}
              navigateTo="order-view"
              previousButtonDisable={currentOrderPage <= 1}
              nextButtonDisable={currentOrderPage * LIMIT_NUMBER >= orders.total_items}
              handlePreviousPage={handlePrevUserPage}
              handleNextPage={handleNextUserPage}
              totalItems={orders.total_items}
              fieldButtonType="view"
              renderItemComponent={(index: number, item: TOrder) => (
                <>
                  <View className="flex-row items-center gap-2">
                    <Text className="font-semibold">{index + 1}.</Text>
                    <Text className="min-w-[85px] w-36" numberOfLines={1} ellipsizeMode="tail">
                      {item.author?.firstname + ' ' + item.author?.lastname}
                    </Text>
                  </View>
                  <Text>{item.items.length}</Text>
                </>
              )}
            />
          </View>
        </ScrollView>
      )}
    </Main>
  );
};
