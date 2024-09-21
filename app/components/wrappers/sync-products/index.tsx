import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { useAppDispatch } from '../../../hooks/redux';
import { setSyncProductsDialogStatus } from '../../../redux/reducers/product/productSlice';
import { ISyncProducts } from '../../../types';

export const ButtonSyncProducts: React.FC<ISyncProducts> = ({ className }) => {
  const dispatch = useAppDispatch();

  const showDialog = () => {
    dispatch(setSyncProductsDialogStatus(true));
  };

  return (
    <TouchableOpacity
      className={`px-6 py-2 bg-orange-400 min-w-[170px] rounded ${className}`}
      onPress={showDialog}>
      <Text className="font-semibold text-white">Սիխրոնիզացնել</Text>
    </TouchableOpacity>
  );
};
