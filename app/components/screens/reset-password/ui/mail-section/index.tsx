import { FormikValues } from 'formik';
import React from 'react';
import { Keyboard, Text, TextInput, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../../../hooks/redux';
import { sendOtpToMailThunk } from '../../../../../redux/http/userThunk';
import { resetPasswordMailFormSchema } from '../../../../../validation';
import { FieldWithError } from '../../../../wrappers';
import { TInitialSendMailFormValue } from '../../types';
import { LayoutResetPassword, ResetPasswordForm, ResetSendButton } from '../../wrapper';

export const MailSection = () => {
  const dispatch = useAppDispatch();
  const { resetPassword } = useAppSelector((state) => state.user);
  const initialSendMailFormValue: TInitialSendMailFormValue = {
    mail: '',
  };
  const onSubmit = (values: FormikValues): void => {
    dispatch(sendOtpToMailThunk(values.mail));
  };

  return (
    <LayoutResetPassword>
      <View className="w-full items-center gap-3">
        <Text className="text-xl font-semibold text-center">Մոռացել ե՞ք գաղտնաբառը</Text>
        <Text className="text-gray-500 text-center text-xs">
          Մուտքագրեք ձեր էլ․ փոստի հասցեն, որպեսզի վերականգնեք գաղտնաբառը։
        </Text>
      </View>
      <View className="w-full items-center mt-5">
        <ResetPasswordForm
          validationSchema={resetPasswordMailFormSchema}
          initialResetPasswordFormValue={initialSendMailFormValue}
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
                <FieldWithError fieldName="mail" errors={errors} touched={touched} className="mb-5">
                  <TextInput
                    onChangeText={handleChange('mail')}
                    onBlur={handleBlur('mail')}
                    onSubmitEditing={Keyboard.dismiss}
                    value={values.mail}
                    className="border-2 rounded-lg w-full py-3 px-5 placeholder:font-semibold placeholder:text-gray-400 text-base border-gray-300"
                    placeholder="Էլ․ փոստ"
                  />
                </FieldWithError>
                <ResetSendButton
                  handleSubmit={handleSubmit}
                  disabled={!dirty || !isValid}
                  isLoading={resetPassword.isLoading}>
                  Կատարել հարցում
                </ResetSendButton>
              </>
            );
          }}
        />
      </View>
    </LayoutResetPassword>
  );
};
