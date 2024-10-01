import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../../../../hooks/redux';
import { useDebounce } from '../../../../../../hooks/useDebounce';
import { useIsTablet } from '../../../../../../hooks/useIsTablet';
import { getOneAdminOrderThunk } from '../../../../../../redux/http/orderThunk';
import { TAdminOrder } from '../../../../../../redux/types/order';
import { formattedTimeForOrderItem } from '../../../../../../utils';
import { getLimitNumber } from '../../../../../../utils/constants';
import { Loading } from '../../../../../ui';
import { CrudList, Main } from '../../../../../wrappers';
import { IOrdersAdminList } from '../../types';
import { CreateEmptyOrder } from '../create-empty-order';

export const OrdersAdminList: React.FC<IOrdersAdminList> = (props) => {
  const { ordersSelector, fetchOrdersThunk } = props;

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

  const executeNavigateAfterThisFn = async (orderId: string) => {
    await dispatch(getOneAdminOrderThunk(orderId));
  };

  return !!isLoading && !hasSearched ? (
    <Loading />
  ) : (
    <Main>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />}
        keyboardShouldPersistTaps="handled">
        <View className="m-4">
          <CrudList
            data={orders}
            executeNavigateAfterThisFn={executeNavigateAfterThisFn}
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
            renderButton={() => <CreateEmptyOrder />}
            renderItemComponent={(index: number, item: TAdminOrder) => {
              const createDate = formattedTimeForOrderItem(item.createdAt as string);

              return (
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
                  <Text className="text-[12px]">{createDate}</Text>
                </>
              );
            }}
          />
        </View>
      </ScrollView>
    </Main>
  );
};
