import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../../../../hooks/redux';
import { useDebounce } from '../../../../../../hooks/useDebounce';
import { useIsTablet } from '../../../../../../hooks/useIsTablet';
import { TAdminOrder } from '../../../../../../redux/types/order';
import { getLimitNumber } from '../../../../../../utils/constants';
import { EmptyOrder, Loading } from '../../../../../ui';
import { CrudList, Main } from '../../../../../wrappers';
import { IOrdersAdminList } from '../../types';

export const OrdersAdminList: React.FC<IOrdersAdminList> = (props) => {
  const { ordersSelector, fetchOrdersThunk, emptyMessage } = props;

  const dispatch = useAppDispatch();
  const { isTablet, executeAfterDeviceCheck } = useIsTablet();
  const LIMIT_NUMBER = getLimitNumber(isTablet);

  const { items: orders, total_items, isLoading } = useAppSelector(ordersSelector);

  const [currentOrderPage, setOrderCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const fetchSearchData = () => {
    dispatch(fetchOrdersThunk({ page: 0, limit: LIMIT_NUMBER, query: debouncedSearch }));
  };

  const fetchData = () => {
    dispatch(fetchOrdersThunk({ page: currentOrderPage, limit: LIMIT_NUMBER, query: searchQuery }));
  };

  useEffect(() => {
    executeAfterDeviceCheck(fetchSearchData);
  }, [debouncedSearch, isTablet]);

  useEffect(() => {
    executeAfterDeviceCheck(fetchData);
  }, [currentOrderPage, isTablet]);

  const handlePrevUserPage = () => {
    if (currentOrderPage > 1) {
      setOrderCurrentPage((prevPage: number) => prevPage - 1);
    }
  };

  const handleNextUserPage = () => {
    if (currentOrderPage * LIMIT_NUMBER < total_items) {
      setOrderCurrentPage((prevPage: number) => prevPage + 1);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  return isLoading && !hasSearched ? (
    <Loading />
  ) : (
    <Main>
      {orders?.length > 0 || hasSearched ? (
        <ScrollView
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />}
          keyboardShouldPersistTaps="handled">
          <View className="m-4">
            <CrudList
              data={orders}
              navigateTo="admin-order-edit"
              previousButtonDisable={currentOrderPage <= 1}
              nextButtonDisable={currentOrderPage * LIMIT_NUMBER >= total_items}
              handlePreviousPage={handlePrevUserPage}
              handleNextPage={handleNextUserPage}
              totalItems={total_items}
              fieldButtonType="view"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              hasSearched={hasSearched}
              setHasSearched={setHasSearched}
              searchFieldPlaceholder="Փնտրել պատվիրատույի անունով"
              renderButton={() => (
                <View className="w-full">
                  <TouchableOpacity
                    className="px-6 py-2 bg-orange-400 self-end rounded"
                    onPress={() => console.log('dwawd')}>
                    <Text className="font-semibold text-white">Ստեղծել պատվեր</Text>
                  </TouchableOpacity>
                </View>
              )}
              renderItemComponent={(index: number, item: TAdminOrder) => (
                <>
                  <View className="flex-row items-center gap-2">
                    <Text className="font-semibold">{index + 1}.</Text>
                    <Text
                      className={`min-w-[85px] ${isTablet ? 'w-56' : 'w-40'}`}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {item.counterpartyName || 'Անանուն պատվեր'}
                    </Text>
                  </View>
                  <Text>{item.items.length}</Text>
                </>
              )}
            />
          </View>
        </ScrollView>
      ) : (
        <View className="h-full items-center justify-center">
          {/* <CreateItemButton
            handleClick={() => console.log('')}
            createButtonLabel="Սիխրոնիզացնել"
            isLoading={false}
          /> */}
          <EmptyOrder text={emptyMessage} />
        </View>
      )}
    </Main>
  );
};
