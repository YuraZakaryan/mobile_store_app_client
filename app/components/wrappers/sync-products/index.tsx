import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { ISyncProducts } from '../../../types';
import { handleSync } from '../../../utils';

export const SyncProducts: React.FC<ISyncProducts> = ({ showDocumentDialogButton, className }) => {
  const { syncProducts } = useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();

  const syncButton = () => {
    handleSync(dispatch);
  };
  const isLoading: boolean = syncProducts.isLoading ?? false;

  return showDocumentDialogButton ? (
    <TouchableOpacity
      className={`px-6 py-2 bg-orange-400 min-w-[170px] rounded ${className}`}
      onPress={syncButton}>
      {isLoading ? (
        <View style={{ height: 17 }}>
          <ActivityIndicator size="small" color="white" style={{ transform: [{ scale: 0.8 }] }} />
        </View>
      ) : (
        <Text className="font-semibold text-white">Սիխրոնիզացնել</Text>
      )}
    </TouchableOpacity>
  ) : null;
};
