import React from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { useDebounce } from '../../../../hooks/useDebounce';
import { useIsTablet } from '../../../../hooks/useIsTablet';
import { fetchAllOrdersThunk } from '../../../../redux/http/orderThunk';
import { TOrder } from '../../../../redux/types/order';
import { getLimitNumber } from '../../../../utils/constants';
import { EmptyOrder, Loading } from '../../../ui';
import { CrudList, Main } from '../../../wrappers';

export const OrdersControl = () => {
  const dispatch = useAppDispatch();
  const { isTablet, executeAfterDeviceCheck } = useIsTablet();
  const LIMIT_NUMBER = getLimitNumber(isTablet);

  const { orders, deliverOrder, changeStatus } = useAppSelector((state) => state.order);
  const [currentOrderPage, setOrderCurrentPage] = React.useState<number>(1);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [hasSearched, setHasSearched] = React.useState<boolean>(false);
  const isLoading = deliverOrder.isLoading || changeStatus.isLoading;

  const debouncedSearch: string = useDebounce(searchQuery, 500);

  const fetchSearchData = (): void => {
    dispatch(fetchAllOrdersThunk({ page: 0, limit: LIMIT_NUMBER, query: debouncedSearch }));
  };

  const fetchData = (): void => {
    dispatch(
      fetchAllOrdersThunk({ page: currentOrderPage, limit: LIMIT_NUMBER, query: searchQuery })
    );
  };

  React.useEffect((): void => {
    executeAfterDeviceCheck(fetchSearchData);
  }, [debouncedSearch, isTablet]);

  React.useEffect((): void => {
    executeAfterDeviceCheck(fetchData);
  }, [currentOrderPage, isLoading, isTablet]);

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

  const handleRefresh = (): void => {
    fetchData();
  };

  return (orders.isLoading && !hasSearched) || isTablet === null ? (
    <Loading />
  ) : (
    <Main>
      {orders.items.length > 0 || hasSearched ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={orders.isLoading as boolean} onRefresh={handleRefresh} />
          }
          keyboardShouldPersistTaps="handled">
          <View className="m-4">
            <CrudList
              data={orders.items}
              navigateTo="order-view"
              previousButtonDisable={currentOrderPage <= 1}
              nextButtonDisable={currentOrderPage * LIMIT_NUMBER >= orders.total_items}
              handlePreviousPage={handlePrevUserPage}
              handleNextPage={handleNextUserPage}
              totalItems={orders.total_items}
              fieldButtonType="view"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              hasSearched={hasSearched}
              setHasSearched={setHasSearched}
              searchFieldPlaceholder="Փնտրել հաճախորդի անունով"
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
      ) : (
        <EmptyOrder text="Պատվերների պատմությունը առկա չէ" />
      )}
    </Main>
  );
};
