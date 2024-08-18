import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useAppDispatch } from '../../../../../../hooks/redux';
import { setSortCategoriesDialogStatus } from '../../../../../../redux/reducers/category/categorySlice';

export const ButtonSortCategories = () => {
  const dispatch = useAppDispatch();

  const showDialog = () => {
    dispatch(setSortCategoriesDialogStatus(true));
  };

  return (
    <TouchableOpacity className="px-6 py-2 bg-orange-400 rounded" onPress={showDialog}>
      <Text className="font-semibold text-xs text-white">Վերադասավորել</Text>
    </TouchableOpacity>
  );
};
