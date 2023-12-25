import React, { PropsWithChildren } from 'react';
import { SafeAreaView } from 'react-native';

export const Main: React.FC<PropsWithChildren> = ({ children }) => {
  return <SafeAreaView>{children}</SafeAreaView>;
};
