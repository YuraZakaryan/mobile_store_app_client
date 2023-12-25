import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { IButtonStatusViewOrder } from '../../types';

export const ButtonStatusViewOrder: React.FC<IButtonStatusViewOrder> = React.memo((props) => {
  const { label, active } = props;

  return (
    <TouchableOpacity
      className={`bg-gray-400 rounded p-3  mb-2 w-full ${
        active || label === 'Չեղարկել' ? 'bg-orange-400' : ''
      }`}>
      <Text className="text-center text-white text-base">{label}</Text>
    </TouchableOpacity>
  );
});
ButtonStatusViewOrder.displayName = 'ButtonStatusViewOrder';