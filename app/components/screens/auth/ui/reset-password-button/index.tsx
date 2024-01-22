import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export const ResetPasswordButton = () => {
  const { navigate } = useNavigation<NavigationProp<ParamListBase>>();

  const handleNavigate = (): void => {
    navigate('reset-password');
  };
  return (
    <TouchableOpacity className="absolute right-3 z-10" onPress={handleNavigate}>
      <Text className="text-[10px] text-orange-500 font-semibold italic">
        Մոռացել եք գաղտնաբա՞ռը
      </Text>
    </TouchableOpacity>
  );
};
