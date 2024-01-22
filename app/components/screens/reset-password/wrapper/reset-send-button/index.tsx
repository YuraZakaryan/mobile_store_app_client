import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

import { IResetSendButton } from '../../types';

export const ResetSendButton: React.FC<IResetSendButton> = React.memo((props) => {
  const { children, handleSubmit, isLoading, disabled } = props;
  return (
    <TouchableOpacity
      className={`min-h-[40px] w-full items-center justify-center p-2 rounded bg-orange-400 ${
        disabled ? 'bg-gray-400' : ''
      }`}
      disabled={disabled}
      onPress={() => handleSubmit()}>
      {isLoading ? (
        <ActivityIndicator size="small" />
      ) : (
        <Text className="text-center font-bold text-white">{children}</Text>
      )}
    </TouchableOpacity>
  );
});
ResetSendButton.displayName = 'ResetSendButton';
