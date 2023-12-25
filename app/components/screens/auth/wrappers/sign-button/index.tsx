import React, { PropsWithChildren } from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

import { ISignButton } from '../../types';

export const SignButton: React.FC<PropsWithChildren<ISignButton>> = (props) => {
  const { children, handleSubmit, isLoading, disabled } = props;
  return (
    <TouchableOpacity
      onPress={handleSubmit}
      disabled={disabled || false}
      className={`min-h-[40px] items-center justify-center p-2 rounded bg-orange-400 ${
        disabled ? 'bg-gray-400' : ''
      }`}>
      {isLoading ? (
        <ActivityIndicator size="small" />
      ) : (
        <Text className="text-base font-bold text-white">{children}</Text>
      )}
    </TouchableOpacity>
  );
};
