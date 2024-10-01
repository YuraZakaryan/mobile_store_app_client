import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { INumericInputCustom } from '../../../types';

export const NumericInputCustom: React.FC<INumericInputCustom> = React.memo((props) => {
  const { value, minValue, maxValue, onChange, disabled } = props;
  const handleIncrement = () => {
    if (value < maxValue) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > minValue) {
      onChange(value - 1);
    }
  };

  return (
    <View
      className={`flex-row border items-center rounded-md border-gray-400 py-0.5 max-w-[156px] ${disabled ? 'border-gray-200' : ''}`}>
      <TouchableOpacity
        onPress={handleDecrement}
        className={`justify-center px-5 items-center border-r-2 border-gray-300 ${disabled ? 'opacity-30' : ''}`}>
        <Text className="text-gray-500  text-base text-center font-medium">-</Text>
      </TouchableOpacity>
      <Text className="px-5 min-w-[55px] text-center">{value}</Text>
      <TouchableOpacity
        onPress={handleIncrement}
        className={`justify-center items-center px-5 border-l-2 border-gray-300 ${disabled ? 'opacity-30' : ''}`}>
        <Text className="text-gray-500 text-base text-center font-medium">+</Text>
      </TouchableOpacity>
    </View>
  );
});
