import { Formik } from 'formik';
import React from 'react';
import { Keyboard, TextInput, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../../../hooks/redux';
import { loginThunk } from '../../../../../redux/http/userThunk';
import { EAuthMode } from '../../../../../redux/types';
import { SHOW_ERROR } from '../../../../../toasts';
import { NETWORK_ERROR_MESSAGE } from '../../../../../utils/constants';
import { loginFormSchema } from '../../../../../validation';
import { FieldWithError, LabelInput } from '../../../../wrappers';
import { initialLoginFormValue } from '../../data';
import { LayoutAuth } from '../../layout';
import { TInitialLoginFormValue } from '../../types';
import { SignButton } from '../../wrappers';
import { ResetPasswordButton } from '../reset-password-button';

export const Login = () => {
  const dispatch = useAppDispatch();

  // Retrieve login state from the Redux store
  const { login } = useAppSelector((state) => state.user);

  // Define a function for handling form submission
  const onSubmit = async (values: TInitialLoginFormValue) => {
    // Dispatch the loginThunk action with the provided form values
    await dispatch(loginThunk(values))
      .unwrap()
      .catch((err): void => {
        switch (err) {
          case 'invalid_login_credentials':
            SHOW_ERROR('Մուտքանունը կամ գաղտնաբառը սխալ է');
            break;
          case 'account_not_confirmed':
            SHOW_ERROR('Ձեր հաշիվը դեռ հաստատված չէ');
            break;
          case 'account_banned':
            SHOW_ERROR('Ձեր հաշիվը արգելափակված է');
            break;
          default:
            SHOW_ERROR(NETWORK_ERROR_MESSAGE);
            break;
        }
      });
  };

  return (
    <LayoutAuth title="Մուտք գործել" buttonTitle="Գրանցվել" switchTo={EAuthMode.REGISTRATION}>
      <Formik
        initialValues={initialLoginFormValue}
        validationSchema={loginFormSchema}
        onSubmit={(values) => onSubmit(values)}>
        {({ handleChange, handleBlur, values, handleSubmit, errors, touched, isValid }) => (
          <View className="p-5 w-full justify-center">
            <LabelInput label="Մուտքանուն" required>
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
            </LabelInput>
            <LabelInput label="Գաղտնաբառ" required>
              <FieldWithError
                fieldName="password"
                errors={errors}
                touched={touched}
                className="relative">
                <View className="justify-center">
                  <ResetPasswordButton />
                  <TextInput
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    onSubmitEditing={Keyboard.dismiss}
                    textContentType="oneTimeCode"
                    value={values.password}
                    placeholder="Գաղտնաբառ"
                    className="rounded px-3 py-4 border border-gray-600 z-5"
                    secureTextEntry
                  />
                </View>
              </FieldWithError>
            </LabelInput>
            <View>
              <SignButton
                handleSubmit={handleSubmit}
                isLoading={login.isLoading ?? false}
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
