import React from 'react';
import { Text, View } from 'react-native';

import { ILabelInput } from '../../../types';

export const LabelInput: React.FC<ILabelInput> = React.memo((props) => {
  const { label, additionalLabel, children, className, icon, required } = props;
  return (
    <View className={`mb-3 relative ${className ? className : ''}`}>
      <View className="flex-row gap-0.5">
        {required ? <Text className="text-red-600">*</Text> : null}
        <Text className="mb-2 font-bold text-gray-600">{label}</Text>
        {additionalLabel ? (
          <Text className="text-gray-500 font-semibold">({additionalLabel})</Text>
        ) : null}
      </View>
      <View>
        {children}
        {icon && <View className="absolute right-3 h-full justify-center">{icon}</View>}
      </View>
    </View>
  );
});
LabelInput.displayName = 'LabelInput';
