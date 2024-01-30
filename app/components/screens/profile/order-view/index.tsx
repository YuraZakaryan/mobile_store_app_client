import { useRoute, useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';

import { TOrderViewRouteParams } from './types';
import { ButtonStatusViewOrder } from './wrappers';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { changeOrderStatusThunk, deliverOrderThunk } from '../../../../redux/http/orderThunk';
import { EOrderStatus, TOrder, TOrderItem } from '../../../../redux/types/order';
import { Main, OrdersList } from '../../../wrappers';

export const OrderView = () => {
  const dispatch = useAppDispatch();
  const route = useRoute();
  const { item }: TOrderViewRouteParams = (route.params as TOrderViewRouteParams) || {};
  const { changeStatus } = useAppSelector((state) => state.order);
  const { navigate } = useNavigation<NavigationProp<ParamListBase>>();

  const handleChangeStatus = React.useCallback(
    (status: EOrderStatus): void => {
      dispatch(
        changeOrderStatusThunk({
          _id: item?._id as string,
          status,
          navigate,
          navigateTo: 'orders-control',
          items: item?.items as TOrderItem[],
        })
      );
    },
    [item]
  );

  const handleDeliverOrder = (): void => {
    dispatch(
      deliverOrderThunk({
        _id: item?._id as string,
        navigate,
        items: item?.items as TOrderItem[],
      })
    );
  };

  return (
    <Main>
      <OrdersList item={item as TOrder}>
        <View className="bg-white items-center w-full rounded-lg">
          <ButtonStatusViewOrder
            label="Պատվիրաված"
            active={item?.status === EOrderStatus.ORDERED}
            status={EOrderStatus.ORDERED}
            handleChangeStatus={handleChangeStatus}
            isLoading={changeStatus.isLoading ?? false}
          />
          <ButtonStatusViewOrder
            label="Ընդունված"
            active={item?.status === EOrderStatus.ACCEPTED}
            status={EOrderStatus.ACCEPTED}
            handleChangeStatus={handleChangeStatus}
            isLoading={changeStatus.isLoading ?? false}
          />
          <ButtonStatusViewOrder
            label="Առաքված"
            active={item?.status === EOrderStatus.DELIVERED}
            status={EOrderStatus.DELIVERED}
            handleChangeStatus={handleDeliverOrder}
            isLoading={changeStatus.isLoading ?? false}
          />
          <ButtonStatusViewOrder
            label="Մերժել"
            active={item?.status === EOrderStatus.REJECTED}
            status={EOrderStatus.REJECTED}
            handleChangeStatus={handleChangeStatus}
            isLoading={changeStatus.isLoading ?? false}
          />
        </View>
      </OrdersList>
    </Main>
  );
};
