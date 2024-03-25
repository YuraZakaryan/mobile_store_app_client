import { NavigationProp, ParamListBase, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';

import { TOrderViewRouteParams } from './types';
import { ButtonStatusViewOrder } from './wrappers';
import { useAppDispatch } from '../../../../hooks/redux';
import { changeOrderStatusThunk, deliverOrderThunk } from '../../../../redux/http/orderThunk';
import { EOrderStatus, TOrder, TOrderItem } from '../../../../redux/types/order';
import { SHOW_SUCCESS } from '../../../../toasts';
import { Main, OrdersList } from '../../../wrappers';

export const OrderView = () => {
  const dispatch = useAppDispatch();
  const route = useRoute();
  const [loadingStates, setLoadingStates] = React.useState({
    [EOrderStatus.ORDERED]: false,
    [EOrderStatus.ACCEPTED]: false,
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

  return (
    <Main>
      <OrdersList item={item as TOrder}>
        <View className="bg-white items-center w-full rounded-lg">
          {item?.status === EOrderStatus.ORDERED && (
            <>
              <ButtonStatusViewOrder
                label="Ընդունել"
                type={EOrderStatus.ACCEPTED}
                handleChangeStatus={handleChangeStatus}
                isLoading={loadingStates[EOrderStatus.ACCEPTED] ?? false}
              />
              <View className="w-full mt-5">
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
      </OrdersList>
    </Main>
  );
};
