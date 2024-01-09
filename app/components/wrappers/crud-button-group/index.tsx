import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';

export const CrudButtonGroup: React.FC<PropsWithChildren> = React.memo(({ children }) => {
  return <View className="gap-2 mt-2">{children}</View>;
});
CrudButtonGroup.displayName = 'CrudButtonGroup';
