import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import { ICrudMainButton } from '../../../types';

export const CrudMainButton: React.FC<ICrudMainButton> = (props) => {
  const { disabled, handleSubmit, isLoading, className, children } = props;

  return (
    <View>
      <TouchableOpacity
        className={`min-h-[40px] items-center justify-center p-2 rounded bg-orange-400 ${
          disabled ? 'bg-gray-400' : ''
        } ${className}`}
        disabled={disabled}
        onPress={() => handleSubmit()}>
        {isLoading ? (
          <ActivityIndicator size={22} />
        ) : (
          <Text className="text-center font-bold text-white">{children}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
