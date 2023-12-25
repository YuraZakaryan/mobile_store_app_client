import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { ICreateItemButton } from '../../../types';

export const CreateItemButton: React.FC<ICreateItemButton> = (props) => {
  const { handleClick, createButtonLabel } = props;
  return (
    <View className="w-full items-center mt-3 rounded bg-white border border-gray-300 p-4 shadow-2xl">
      <TouchableOpacity className="bg-orange-400 p-3 rounded shadow-2xl" onPress={handleClick}>
        <Text className="text-white font-semibold">{createButtonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};
