import { FormikValues } from 'formik';
import React from 'react';
import { Text, View } from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';

import { useAppDispatch, useAppSelector } from '../../../../../hooks/redux';
import { confirmOtpThunk } from '../../../../../redux/http/userThunk';
import { ICON_MAIN_COLOR } from '../../../../../utils/constants';
import { resetPasswordOtpFormSchema } from '../../../../../validation';
import { FieldWithError } from '../../../../wrappers';
import { TInitialSendOtpFormValue } from '../../types';
import { LayoutResetPassword, ResetPasswordForm, ResetSendButton } from '../../wrapper';
export const OtpSection = () => {
  const dispatch = useAppDispatch();

  // Retrieve the resetPassword state from the Redux store's user slice
  const { resetPassword } = useAppSelector((state) => state.user);

  // Initial form values for confirming OTP
  const initialSendOtpFormValue: TInitialSendOtpFormValue = {
    otp: '',
  };

  // Form submission handler for confirming OTP with the provided OTP and mail
  const onSubmit = (values: FormikValues): void => {
    dispatch(confirmOtpThunk({ otp: values.otp, mail: resetPassword.mail }));
  };
  return (
    <LayoutResetPassword>
      <View className="w-full items-center gap-3">
        <Text className="text-xl font-semibold text-center">
          Մուտքագրեք մեկ անգամյա օգտագործման գաղտնաբառը։
        </Text>
        <Text className="text-gray-500 text-center text-xs">
          OTP ֊ին ուղարկվել է ձեր նշած էլ․ փոստին
        </Text>
      </View>
      <View className="w-full items-center mt-5">
        <ResetPasswordForm
          validationSchema={resetPasswordOtpFormSchema}
          initialResetPasswordFormValue={initialSendOtpFormValue}
          onSubmit={onSubmit}
          renderItemComponent={(formikProps) => {
            const { errors, dirty, touched, values, handleChange, handleSubmit, isValid } =
              formikProps;
            return (
              <>
                <FieldWithError fieldName="mail" errors={errors} touched={touched} className="mb-5">
                  <OTPTextInput
                    defaultValue={values.otp}
                    handleTextChange={(text: string) => handleChange('otp')(text)}
                    tintColor={ICON_MAIN_COLOR}
                    keyboardType="number-pad"
                  />
                </FieldWithError>
                <ResetSendButton
                  handleSubmit={handleSubmit}
                  disabled={!dirty || !isValid}
                  isLoading={resetPassword.isLoading}>
                  Ուղարկել
                </ResetSendButton>
              </>
            );
          }}
        />
      </View>
    </LayoutResetPassword>
  );
};
