import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { IButtonTab } from '../../../types';

export const ButtonTab: React.FC<IButtonTab> = (props) => {
  const { activeTab, expectedTab, tabName, handleTabClick, className } = props;

  return (
    <TouchableOpacity
      className={`items-center justify-center bg-white py-2 min-w-[180px] ${className} ${
        activeTab === expectedTab ? ' bg-orange-400 rounded-lg' : ''
      }`}
      onPress={() => handleTabClick(expectedTab)}>
      <Text className={`text-sm text-gray-500 ${activeTab === expectedTab ? ' text-black' : ''}`}>
        {tabName}
      </Text>
    </TouchableOpacity>
  );
};
