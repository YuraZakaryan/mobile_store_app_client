import { FontAwesome } from '@expo/vector-icons';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import React, { PropsWithChildren } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
} from 'react-native';

import { useAppDispatch } from '../../../../../hooks/redux';
import { clearResetPassword } from '../../../../../redux/reducers/user/userSlice';
import { Main } from '../../../../wrappers';

export const LayoutResetPassword: React.FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { goBack } = useNavigation<NavigationProp<ParamListBase>>();
  const handleGoBack = (): void => {
    goBack();
    dispatch(clearResetPassword());
  };

  return (
    <Main>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled
        keyboardVerticalOffset={Platform.select({ ios: 80, android: 145 })}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView contentContainerStyle={styles.container}>
            <View className="mx-4 p-4 bg-white rounded-lg shadow">
              {children}
              <TouchableOpacity
                className="mt-3 flex-row items-center justify-center"
                onPress={handleGoBack}>
                <FontAwesome name="long-arrow-left" size={16} color="gray" />
                <Text className="ml-1 text-gray-500 font-semibold">Դեպի մուտքի էջ</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Main>
  );
};
LayoutResetPassword.displayName = 'LayoutResetPassword';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    height: '100%',
    justifyContent: 'center',
  },
});
