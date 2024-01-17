import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import { IDeleteButton } from '../../../types';

export const DeleteButton: React.FC<IDeleteButton> = (props) => {
  const { children, handleDelete, isLoading, className } = props;
  return (
    <View>
      <TouchableOpacity
        className={`min-h-[40px] items-center justify-center p-2 rounded bg-red-500 ${
          className ? className : ''
        }`}
        onPress={handleDelete}>
        {isLoading ? (
          <ActivityIndicator size="small" />
        ) : (
          <Text className="text-base font-bold text-white">{children}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
