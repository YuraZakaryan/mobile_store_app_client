import { NavigationProp, ParamListBase, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import {
  changeOrderStatusThunk,
  deliverOrderThunk,
  getProductsWithStocksThunk,
} from '../../../../redux/http/orderThunk';
import { EOrderStatus, TOrder, TOrderItem } from '../../../../redux/types/order';
import { SHOW_SUCCESS } from '../../../../toasts';
import { ICON_MAIN_COLOR } from '../../../../utils/constants';
import { Main, OrdersList } from '../../../wrappers';
import { OrderInfoItem } from '../order-completed-view/wrapper/oreder-info-item';
import { TOrderViewRouteParams } from './types';
import { ButtonStatusViewOrder } from './wrappers';

export const OrderView = () => {
  const dispatch = useAppDispatch();
  const { productsWithStocks } = useAppSelector((state) => state.order);
  const [selectedStocks, setSelectedStocks] = React.useState<Record<string, string | null>>({});

  const route = useRoute();
  const [loadingStates, setLoadingStates] = React.useState({
    [EOrderStatus.ORDERED]: false,
    [EOrderStatus.ACCEPTED]: false,
    [EOrderStatus.DELIVERED]: false,
    [EOrderStatus.REJECTED]: false,
  });
  const { item }: TOrderViewRouteParams = (route.params as TOrderViewRouteParams) || {};
  const { navigate } = useNavigation<NavigationProp<ParamListBase>>();

  React.useEffect(() => {
    const data = item?.items;
    if (data) {
      const productIds = data.map((item) => item.product._id);
      dispatch(getProductsWithStocksThunk(productIds));
    }
  }, [item]);

  const handleChangeStatus = React.useCallback(
    (status: EOrderStatus): void => {
      setLoadingStates((prevLoadingStates) => ({
        ...prevLoadingStates,
        [status]: true,
      }));

      dispatch(
        changeOrderStatusThunk({
          _id: item?._id as string,
          status,
          navigate,
          navigateTo: 'orders-control',
          items: item?.items as TOrderItem[],
        })
      )
        .unwrap()
        .then((res: TOrder) => res && SHOW_SUCCESS('Պատվերի կարգավիճակը փոխվեց'))
        .finally(() => {
          // Set loading state for the specific button back to false
          setLoadingStates((prevLoadingStates) => ({
            ...prevLoadingStates,
            [status]: false,
          }));
        });
    },
    [item]
  );

  const handleDeliverOrder = (): void => {
    setLoadingStates((prevLoadingStates) => ({
      ...prevLoadingStates,
      [EOrderStatus.DELIVERED]: true,
    }));

    dispatch(
      deliverOrderThunk({
        _id: item?._id as string,
        navigate,
        items: item?.items as TOrderItem[],
      })
    )
      .unwrap()
      .then((res: TOrder) => res && SHOW_SUCCESS('Պատվերը նշվեց որպես առաքված'))
      .finally(() => {
        setLoadingStates((prevLoadingStates) => ({
          ...prevLoadingStates,
          [EOrderStatus.DELIVERED]: false,
        }));
      });
  };

  const handleSelectStock = (productId: string, stockId: string, count: number) => {
    if (count > 0) {
      setSelectedStocks((prevSelectedStocks) => {
        const currentSelectedStockId = prevSelectedStocks[productId];

        return {
          ...prevSelectedStocks,
          [productId]: currentSelectedStockId === stockId ? null : stockId,
        };
      });
    }
  };

  const productsWithStocksItems = productsWithStocks.items;
  const isStocksLoading = productsWithStocks.isLoading;
  const areAllStocksSelected = productsWithStocksItems.every(
    (product) => selectedStocks[product.id] !== null && selectedStocks[product.id] !== undefined
  );

  return (
    <Main>
      <OrdersList item={item as TOrder}>
        {isStocksLoading ? (
          <ActivityIndicator size="small" color={ICON_MAIN_COLOR} />
        ) : (
          <View className="w-full">
            <View className="w-full space-y-3">
              <Text className="text-base font-bold text-gray-500">Պահեստներ</Text>
              <FlatList
                data={productsWithStocksItems}
                scrollEnabled={false}
                renderItem={({ item }) => {
                  const selectedStockId = selectedStocks[item.id];

                  return (
                    <View key={item.id} className="space-y-1">
                      <Text className="text-sm text-gray-500 font-semibold">{item.name}</Text>
                      <FlatList
                        data={item.stocks}
                        scrollEnabled={false}
                        renderItem={({ item: stock }) => {
                          const isSelected = selectedStockId === stock.id;

                          return (
                            <TouchableOpacity
                              key={stock.id}
                              disabled={stock.count <= 0}
                              onPress={() => handleSelectStock(item.id, stock.id, stock.count)}>
                              <OrderInfoItem
                                label={stock.name}
                                text={`${stock.count} հատ`}
                                className={`${isSelected ? 'border border-orange-400' : ''}`}
                                textClassName={`${stock.count <= 0 ? 'opacity-20' : ''}`}
                              />
                            </TouchableOpacity>
                          );
                        }}
                      />
                    </View>
                  );
                }}
              />
              {!areAllStocksSelected ? (
                <Text className="text-xs text-center text-red-600 -translate-y-4">
                  (Շարունակելու համար պահեստ ընտրելը պարտադիր է)
                </Text>
              ) : null}
            </View>

            <View className="items-center w-full rounded-lg">
              {item?.status === EOrderStatus.ORDERED && (
                <>
                  <ButtonStatusViewOrder
                    label="Ընդունել"
                    type={EOrderStatus.ACCEPTED}
                    handleChangeStatus={handleChangeStatus}
                    isDisable={!areAllStocksSelected}
                    isLoading={loadingStates[EOrderStatus.ACCEPTED] ?? false}
                  />
                  <View className="w-full mt-2">
                    <ButtonStatusViewOrder
                      label="Մերժել"
                      type={EOrderStatus.REJECTED}
                      handleChangeStatus={handleChangeStatus}
                      isLoading={loadingStates[EOrderStatus.REJECTED] ?? false}
                    />
                  </View>
                </>
              )}
              {item?.status === EOrderStatus.ACCEPTED && (
                <ButtonStatusViewOrder
                  label="Նշել որպես առաքված"
                  type={EOrderStatus.DELIVERED}
                  handleChangeStatus={handleDeliverOrder}
                  isLoading={loadingStates[EOrderStatus.DELIVERED] ?? false}
                />
              )}
            </View>
          </View>
        )}
      </OrdersList>
    </Main>
  );
};
