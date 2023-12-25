import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { TClassName } from '../../../../../../types';

export interface ILastOrderButton extends TClassName {
  label: string;
  navigateTo: string;
}

export const LastOrderButton: React.FC<ILastOrderButton> = (props) => {
  const { label, navigateTo, className } = props;
  const { navigate } = useNavigation<NavigationProp<ParamListBase>>();

  const handleNavigate = (): void => {
    navigate(navigateTo);
  };

  return (
    <TouchableOpacity
      className={`flex-1 flex-row justify-between px-4 bg-white py-5 items-center ${
        className ? className : ''
      }`}
      onPress={handleNavigate}>
      <Text className="text-lg text-gray-400">{label}</Text>
      <Ionicons name="arrow-forward" size={24} color="gray" />
    </TouchableOpacity>
  );
};
