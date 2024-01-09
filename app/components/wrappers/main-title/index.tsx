import React, { PropsWithChildren } from 'react';
import { Text } from 'react-native';

export const MainTitle: React.FC<PropsWithChildren> = ({ children }) => {
  return <Text className="font-bold text-2xl text-orange-400 text-center">{children}</Text>;
};
