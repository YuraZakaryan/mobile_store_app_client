import { useRoute, useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';

import { TOrderViewRouteParams } from './types';
import { ButtonStatusViewOrder } from './wrappers';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { changeOrderStatusThunk, deliverOrderThunk } from '../../../../redux/http/orderThunk';
import { EOrderStatus, TOrder } from '../../../../redux/types/order';
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
            isLoading={changeStatus.isLoading}
          />
          <ButtonStatusViewOrder
            label="Ընդունված"
            active={item?.status === EOrderStatus.ACCEPTED}
            status={EOrderStatus.ACCEPTED}
            handleChangeStatus={handleChangeStatus}
            isLoading={changeStatus.isLoading}
          />
          <ButtonStatusViewOrder
            label="Առաքված"
            active={item?.status === EOrderStatus.DELIVERED}
            status={EOrderStatus.DELIVERED}
            handleChangeStatus={handleDeliverOrder}
            isLoading={changeStatus.isLoading}
          />
        </View>
      </OrdersList>
    </Main>
  );
};
