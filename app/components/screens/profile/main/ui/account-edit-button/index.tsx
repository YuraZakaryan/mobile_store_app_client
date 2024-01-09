import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { TClassName } from '../../../../../../types';

export interface IAccountEditButtonProps<T> extends TClassName {
  label: string;
  navigateTo: string;
  item: T;
}

export const AccountEditButton = <T,>(props: IAccountEditButtonProps<T>): React.ReactElement => {
  const { label, navigateTo, className, item } = props;
  const { navigate } = useNavigation<NavigationProp<ParamListBase>>();

  const handleNavigate = (): void => {
    navigate(navigateTo, { item, isUser: true });
  };

  return (
    <TouchableOpacity
      className={`flex-1 justify-between px-4 bg-white py-5 ${className ? className : ''}`}
      onPress={handleNavigate}>
      <Text className="text-lg text-gray-400">{label}</Text>
    </TouchableOpacity>
  );
};
