import React, { PropsWithChildren } from 'react';
import { Pressable, Text } from 'react-native';

import { EAuthMode } from '../../../../../redux/types';

export interface ISwitchAuthModeButton {
  handleSwitch: (switchTo: EAuthMode) => void;
  switchTo: EAuthMode;
}

export const SwitchAuthModeButton: React.FC<PropsWithChildren<ISwitchAuthModeButton>> = (props) => {
  const { children, handleSwitch, switchTo } = props;
  return (
    <Pressable className="ml-1.5" onPress={() => handleSwitch(switchTo)}>
      <Text className="text-base italic underline text-orange-500">{children}</Text>
    </Pressable>
  );
};
