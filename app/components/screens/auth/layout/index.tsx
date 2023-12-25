import { FontAwesome } from '@expo/vector-icons';
import React, { PropsWithChildren } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppDispatch } from '../../../../hooks/redux';
import { setAuthMode } from '../../../../redux/reducers/user/userSlice';
import { EAuthMode } from '../../../../redux/types';
import { ICON_MAIN_COLOR } from '../../../../utils/constants';
import { MainTitle } from '../../../wrappers';
import { ILayoutAuth } from '../types';
import { SwitchAuthModeButton } from '../wrappers';

export const LayoutAuth: React.FC<PropsWithChildren<ILayoutAuth>> = React.memo((props) => {
  const { switchTo, children, title, buttonTitle } = props;
  const dispatch = useAppDispatch();

  const handleSwitch = (mode: EAuthMode): void => {
    dispatch(setAuthMode(mode));
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled
      keyboardVerticalOffset={Platform.select({ ios: 80, android: 145 })}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            // flex: Platform.OS === 'ios' ? 1 : 0,
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View className="flex-1 w-full justify-center items-center">
            <View className="items-center w-full">
              <FontAwesome
                name="user"
                size={85}
                style={{
                  color: ICON_MAIN_COLOR,
                }}
              />
              <MainTitle>{title}</MainTitle>
            </View>
            {children}
            <View className="items-center flex-row justify-center mt-2">
              <Text className="font-bold">Դեռ չունե՞ք հաշիվ</Text>
              <SwitchAuthModeButton handleSwitch={handleSwitch} switchTo={switchTo}>
                {buttonTitle}
              </SwitchAuthModeButton>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
});
LayoutAuth.displayName = 'LayoutAuth';
