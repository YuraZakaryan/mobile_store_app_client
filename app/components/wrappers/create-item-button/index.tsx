import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import { ICreateItemButton } from '../../../types';

export const CreateItemButton: React.FC<ICreateItemButton> = (props) => {
  const { handleClick, createButtonLabel, isLoading } = props;
  return (
    <View className="w-full items-center mt-3 rounded bg-white border border-gray-300 p-4 shadow-2xl">
      <TouchableOpacity
        className="bg-orange-400 p-3 rounded min-w-[155px] shadow-2xl"
        onPress={handleClick}>
        {isLoading ? (
          <View style={{ height: 17 }}>
            <ActivityIndicator size="small" color="white" style={{ transform: [{ scale: 0.8 }] }} />
          </View>
        ) : (
          <Text className="text-white text-center font-semibold">{createButtonLabel}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
