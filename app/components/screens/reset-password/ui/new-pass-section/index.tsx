import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { FormikValues } from 'formik';
import React from 'react';
import { Keyboard, Text, TextInput, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../../../hooks/redux';
import { resetPasswordThunk } from '../../../../../redux/http/userThunk';
import { setNewPasswordFormSchema } from '../../../../../validation';
import { FieldWithError, LabelInput } from '../../../../wrappers';
import { TInitialSetNewPassFormValue } from '../../types';
import { LayoutResetPassword, ResetPasswordForm, ResetSendButton } from '../../wrapper';

export const NewPassSection = () => {
  const dispatch = useAppDispatch();

  // Retrieve the resetPassword state from the Redux store's user slice
  const { resetPassword } = useAppSelector((state) => state.user);

  // React Navigation hook for navigation actions
  const { navigate } = useNavigation<NavigationProp<ParamListBase>>();

  // Initial form values for setting a new password
  const initialSetNewPassFormValue: TInitialSetNewPassFormValue = {
    newPassword: '',
    confirmPassword: '',
  };

  // Form submission handler for resetting the password with the provided values
  const onSubmit = (values: FormikValues) => {
    dispatch(
      resetPasswordThunk({
        newPassword: values.newPassword,
        otp: resetPassword.otp,
        mail: resetPassword.mail,
        navigate,
      })
    );
  };

  return (
    <LayoutResetPassword>
      <View className="w-full items-center gap-3">
        <Text className="text-xl font-semibold text-center w-full">Մուտքագրեք նոր գաղտնաբառ</Text>
        <View className="flex-row items-center">
          <Text className="text-orange-500 font-bold mr-1">Էլ․ փոստ։</Text>
          <Text className="text-gray-500 italic font-semibold">{resetPassword.mail}</Text>
        </View>
      </View>
      <View className="w-full items-center mt-5">
        <ResetPasswordForm
          validationSchema={setNewPasswordFormSchema}
          initialResetPasswordFormValue={initialSetNewPassFormValue}
          onSubmit={onSubmit}
          renderItemComponent={(formikProps) => {
            const {
              errors,
              dirty,
              touched,
              values,
              handleChange,
              handleBlur,
              handleSubmit,
              isValid,
            } = formikProps;
            return (
              <>
                <LabelInput label="Նոր գաղտնաբառ" required>
                  <FieldWithError fieldName="newPassword" errors={errors} touched={touched}>
                    <TextInput
                      onChangeText={handleChange('newPassword')}
                      onBlur={handleBlur('newPassword')}
                      onSubmitEditing={Keyboard.dismiss}
                      value={values.newPassword}
                      placeholder="Նոր գաղտնաբառ"
                      className="rounded px-3 py-3 border border-gray-600"
                      secureTextEntry
                    />
                  </FieldWithError>
                </LabelInput>
                <LabelInput label="Կրկնել գաղտնաբառը" required>
                  <FieldWithError fieldName="confirmPassword" errors={errors} touched={touched}>
                    <TextInput
                      onChangeText={handleChange('confirmPassword')}
                      onBlur={handleBlur('confirmPassword')}
                      onSubmitEditing={Keyboard.dismiss}
                      value={values.confirmPassword}
                      placeholder="Կրկնել գաղտնաբառը"
                      className="rounded px-3 py-3 border border-gray-600"
                      secureTextEntry
                    />
                  </FieldWithError>
                </LabelInput>
                <ResetSendButton
                  handleSubmit={handleSubmit}
                  disabled={!dirty || !isValid}
                  isLoading={resetPassword.isLoading}>
                  Փոխել
                </ResetSendButton>
              </>
            );
          }}
        />
      </View>
    </LayoutResetPassword>
  );
};
