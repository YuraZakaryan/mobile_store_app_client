import { NavigationProp, ParamListBase, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import {
  changeOrderStatusThunk,
  deliverOrderThunk,
} from '../../../../redux/http/orderThunk';
import { EOrderStatus, TOrder, TOrderItem } from '../../../../redux/types/order';
import { SHOW_SUCCESS } from '../../../../toasts';
import { ICON_MAIN_COLOR } from '../../../../utils/constants';
import { Main, OrdersList } from '../../../wrappers';
import { TOrderViewRouteParams } from './types';
import { ButtonStatusViewOrder } from './wrappers';

export const OrderView = () => {
  const dispatch = useAppDispatch();
  const { productsWithStocks } = useAppSelector((state) => state.order);

  const route = useRoute();
  const [loadingStates, setLoadingStates] = React.useState({
    [EOrderStatus.ORDERED]: false,
    [EOrderStatus.CONFIRMED]: false,
    [EOrderStatus.DELIVERED]: false,
    [EOrderStatus.REJECTED]: false,
  });
  const { item }: TOrderViewRouteParams = (route.params as TOrderViewRouteParams) || {};
  const { navigate } = useNavigation<NavigationProp<ParamListBase>>();

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

  const isStocksLoading = productsWithStocks.isLoading;
  const areAllStocksSelected = true;

  return (
    <Main>
      <OrdersList item={item as TOrder}>
        {isStocksLoading ? (
          <ActivityIndicator size="small" color={ICON_MAIN_COLOR} />
        ) : (
          <View className="items-center w-full rounded-lg">
            {item?.status === EOrderStatus.ORDERED && (
              <>
                <ButtonStatusViewOrder
                  label="Ընդունել"
                  type={EOrderStatus.CONFIRMED}
                  handleChangeStatus={handleChangeStatus}
                  isDisable={!areAllStocksSelected}
                  isLoading={loadingStates[EOrderStatus.CONFIRMED] ?? false}
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
            {item?.status === EOrderStatus.CONFIRMED && (
              <ButtonStatusViewOrder
                label="Նշել որպես առաքված"
                type={EOrderStatus.DELIVERED}
                handleChangeStatus={handleDeliverOrder}
                isLoading={loadingStates[EOrderStatus.DELIVERED] ?? false}
              />
            )}
          </View>
        )}
      </OrdersList>
    </Main>
  );
};
