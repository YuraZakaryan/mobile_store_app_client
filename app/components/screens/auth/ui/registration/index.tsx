import { Formik } from 'formik';
import React from 'react';
import { Keyboard, TextInput, View } from 'react-native';
import MaskInput from 'react-native-mask-input';

import { useAppDispatch, useAppSelector } from '../../../../../hooks/redux';
import { registrationThunk } from '../../../../../redux/http/userThunk';
import { EAuthMode } from '../../../../../redux/types';
import { registrationFormSchema } from '../../../../../validation';
import { FieldWithError } from '../../../../wrappers';
import { initialRegistrationFormValue } from '../../data';
import { LayoutAuth } from '../../layout';
import { TInitialRegistrationFormValue } from '../../types';
import { SignButton } from '../../wrappers';

export const Registration = () => {
  const dispatch = useAppDispatch();
  const { registration } = useAppSelector((state) => state.user);
  const onSubmit = async (values: TInitialRegistrationFormValue) => {
    await dispatch(registrationThunk(values));
  };
  return (
    <LayoutAuth title="Գրանցվել" buttonTitle="Մուտք գործել" switchTo={EAuthMode.LOGIN}>
      <Formik
        initialValues={initialRegistrationFormValue}
        validationSchema={registrationFormSchema}
        onSubmit={(values) => onSubmit(values)}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
          <View className="p-5 w-full justify-center">
            <FieldWithError fieldName="firstname" errors={errors} touched={touched}>
              <TextInput
                onChangeText={handleChange('firstname')}
                onBlur={handleBlur('firstname')}
                onSubmitEditing={Keyboard.dismiss}
                placeholder="Անուն"
                className="rounded px-3 py-4 border border-gray-600"
              />
            </FieldWithError>
            <FieldWithError fieldName="lastname" errors={errors} touched={touched}>
              <TextInput
                onChangeText={handleChange('lastname')}
                onBlur={handleBlur('lastname')}
                onSubmitEditing={Keyboard.dismiss}
                placeholder="Ազգանուն"
                className="rounded px-3 py-4 border border-gray-600"
              />
            </FieldWithError>
            <FieldWithError fieldName="username" errors={errors} touched={touched}>
              <TextInput
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                onSubmitEditing={Keyboard.dismiss}
                placeholder="Մուտքանուն"
                className="rounded px-3 py-4 border border-gray-600"
              />
            </FieldWithError>
            <FieldWithError fieldName="phone" errors={errors} touched={touched}>
              <MaskInput
                className="rounded px-3 py-4 border border-gray-600"
                value={values.phone}
                onChangeText={(unmasked) => {
                  handleChange('phone')(unmasked.replace(/\D/g, ''));
                }}
                mask={[
                  '(',
                  /\d/,
                  /\d/,
                  /\d/,
                  ')',
                  ' ',
                  /\d/,
                  /\d/,
                  '-',
                  /\d/,
                  /\d/,
                  '-',
                  /\d/,
                  /\d/,
                ]}
              />
            </FieldWithError>
            <FieldWithError fieldName="password" errors={errors} touched={touched}>
              <TextInput
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                onSubmitEditing={Keyboard.dismiss}
                placeholder="Գաղտնաբառ"
                className="rounded px-3 py-4 border border-gray-600"
                secureTextEntry
              />
            </FieldWithError>
            <FieldWithError fieldName="confirmPassword" errors={errors} touched={touched}>
              <TextInput
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                onSubmitEditing={Keyboard.dismiss}
                placeholder="Կրկնել գաղտնաբառը"
                className="rounded px-3 py-4 border border-gray-600"
                secureTextEntry
              />
            </FieldWithError>
            <View>
              <SignButton
                handleSubmit={handleSubmit}
                isLoading={registration.isLoading}
                disabled={!isValid}>
                Գրանցվել
              </SignButton>
            </View>
          </View>
        )}
      </Formik>
    </LayoutAuth>
  );
};
