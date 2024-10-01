import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../../../../hooks/redux';
import { useIsTablet } from '../../../../../../hooks/useIsTablet';
import { createEmptyAdminOrderThunk } from '../../../../../../redux/http/orderThunk';
import { SHOW_ERROR } from '../../../../../../toasts';
import { NETWORK_ERROR_MESSAGE } from '../../../../../../utils/constants';
import { TUserListNavigationProps } from '../../../users-control/types';

export const CreateEmptyOrder = () => {
  const dispatch = useAppDispatch();
  const { isTablet } = useIsTablet();

  const { navigate } = useNavigation<NavigationProp<TUserListNavigationProps>>();

  const { createEmpty } = useAppSelector((state) => state.order);

  const handleClick = (): void => {
    dispatch(createEmptyAdminOrderThunk())
      .unwrap()
      .then((res) => {
        navigate('admin-order-edit', { res });
      })
      .catch((err): void => {
        switch (err) {
          case 409:
            SHOW_ERROR('Հայտնաբերվել է անանուն պատվեր');
            break;
          default:
            SHOW_ERROR(NETWORK_ERROR_MESSAGE);
            break;
        }
      });
  };

  const isLoading = createEmpty.isLoading;

  return (
    <View className="w-full">
      <TouchableOpacity
        className={`px-6 py-2 self-end rounded ${isTablet ? 'min-w-[173px]' : 'min-w-[161px]'}  ${isLoading ? 'bg-slate-500' : 'bg-orange-400'}`}
        onPress={handleClick}>
        {isLoading ? (
          <View style={{ height: 17 }}>
            <ActivityIndicator size="small" color="white" style={{ transform: [{ scale: 0.8 }] }} />
          </View>
        ) : (
          <Text className="font-semibold text-white text-xs">Ստեղծել պատվեր</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
