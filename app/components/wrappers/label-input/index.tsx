import React from 'react';
import { Text, View } from 'react-native';

import { ILabelInput } from '../../../types';

export const LabelInput: React.FC<ILabelInput> = React.memo((props) => {
  const { label, children, className, icon } = props;
  return (
    <View className={`ml-4 mb-3 relative ${className ? className : ''}`}>
      <Text className="mb-2 font-bold text-gray-600">{label}</Text>
      <View>
        {children}
        {icon && <View className="absolute right-3 h-full justify-center">{icon}</View>}
      </View>
    </View>
  );
});
LabelInput.displayName = 'LabelInput';
