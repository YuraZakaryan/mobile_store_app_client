import { Formik } from 'formik';
import React from 'react';
import { Keyboard, TextInput, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../../../hooks/redux';
import { loginThunk } from '../../../../../redux/http/userThunk';
import { EAuthMode } from '../../../../../redux/types';
import { loginFormSchema } from '../../../../../validation';
import { FieldWithError } from '../../../../wrappers';
import { initialLoginFormValue } from '../../data';
import { LayoutAuth } from '../../layout';
import { TInitialLoginFormValue } from '../../types';
import { SignButton } from '../../wrappers';

export const Login = () => {
  const dispatch = useAppDispatch();
  const { login } = useAppSelector((state) => state.user);
  const onSubmit = async (values: TInitialLoginFormValue) => {
    await dispatch(loginThunk(values));
  };
  return (
    <LayoutAuth title="Մուտք գործել" buttonTitle="Գրանցվել" switchTo={EAuthMode.REGISTRATION}>
      <Formik
        initialValues={initialLoginFormValue}
        validationSchema={loginFormSchema}
        onSubmit={(values) => onSubmit(values)}>
        {({ handleChange, handleBlur, values, handleSubmit, errors, touched, isValid }) => (
          <View className="p-5 w-full justify-center">
            <FieldWithError fieldName="username" errors={errors} touched={touched}>
              <TextInput
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                onSubmitEditing={Keyboard.dismiss}
                value={values.username}
                placeholder="Մուտքանուն"
                className="rounded px-3 py-4 border border-gray-600"
              />
            </FieldWithError>

            <FieldWithError fieldName="password" errors={errors} touched={touched}>
              <TextInput
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                onSubmitEditing={Keyboard.dismiss}
                value={values.password}
                placeholder="Գաղտնաբառ"
                className="rounded px-3 py-4 border border-gray-600"
                secureTextEntry
              />
            </FieldWithError>

            <View>
              <SignButton
                handleSubmit={handleSubmit}
                isLoading={login.isLoading}
                disabled={!isValid}>
                Մուտք
              </SignButton>
            </View>
          </View>
        )}
      </Formik>
    </LayoutAuth>
  );
};