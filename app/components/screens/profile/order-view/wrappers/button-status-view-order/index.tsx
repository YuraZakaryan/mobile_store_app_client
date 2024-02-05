import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

import { IButtonStatusViewOrder } from '../../types';

export const ButtonStatusViewOrder: React.FC<IButtonStatusViewOrder> = React.memo((props) => {
  const { label, active, status, handleChangeStatus, isLoading } = props;

  return (
    <TouchableOpacity
      className={`bg-gray-400 rounded p-3 min-h-[49px] mb-2 w-full ${
        active || label === 'Չեղարկել' ? 'bg-orange-400' : ''
      }`}
      disabled={isLoading || active}
      onPress={() => handleChangeStatus(status)}>
      {isLoading ? (
        <ActivityIndicator size="small" />
      ) : (
        <Text className="text-center text-white text-base">{label}</Text>
      )}
    </TouchableOpacity>
  );
});
ButtonStatusViewOrder.displayName = 'ButtonStatusViewOrder';
