import { NavigationProp, ParamListBase, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { cancelOrderThunk } from '../../../../redux/http/orderThunk';
import { EOrderStatus, TOrder } from '../../../../redux/types/order';
import { formatDate, hasTimePassed } from '../../../../utils';
import { Main, OrdersList } from '../../../wrappers';
import { TOrderViewRouteParams } from '../order-view/types';
import { ButtonStatusViewOrder } from '../order-view/wrappers';

export const OrderCompletedView = () => {
  const dispatch = useAppDispatch();
  const route = useRoute();
  const { navigate } = useNavigation<NavigationProp<ParamListBase>>();
  const { item }: TOrderViewRouteParams = (route.params as TOrderViewRouteParams) || {};
  const { cancelOrder } = useAppSelector((state) => state.order);

  const handleCancelOrder = React.useCallback((): void => {
    dispatch(
      cancelOrderThunk({
        _id: item?._id as string,
        navigate,
      })
    );
  }, [item]);

  return (
    <Main>
      <OrdersList item={item as TOrder}>
        <View className="bg-white items-center w-full rounded-lg">
          {item?.status === EOrderStatus.REJECTED ? (
            <View className="p-3">
              <Text className="text-red-500 text-center font-bold text-xl">Մերժված</Text>
            </View>
          ) : !hasTimePassed(formatDate(item?.deliveredTime as string), 86400) ? (
            <>
              <ButtonStatusViewOrder
                label="Չեղարկել"
                status={EOrderStatus.ACCEPTED}
                isLoading={cancelOrder.isLoading ?? false}
                handleChangeStatus={handleCancelOrder}
              />
              <View className="p-3">
                <Text className="text-red-800 text-center">
                  Չեղարկումը հնարավոր է կատարել <Text className="font-bold">1</Text> օրվա ընթացքում
                </Text>
              </View>
            </>
          ) : null}
        </View>
      </OrdersList>
    </Main>
  );
};
