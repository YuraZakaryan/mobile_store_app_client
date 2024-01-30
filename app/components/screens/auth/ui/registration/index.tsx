import { Formik } from 'formik';
import React from 'react';
import { Keyboard, TextInput, View } from 'react-native';
import MaskInput from 'react-native-mask-input';

import { useAppDispatch, useAppSelector } from '../../../../../hooks/redux';
import { registrationThunk } from '../../../../../redux/http/userThunk';
import { EAuthMode } from '../../../../../redux/types';
import { registrationFormSchema } from '../../../../../validation';
import { FieldWithError, LabelInput } from '../../../../wrappers';
import { initialRegistrationFormValue } from '../../data';
import { LayoutAuth } from '../../layout';
import { TInitialRegistrationFormValue } from '../../types';
import { SignButton } from '../../wrappers';

export const Registration = () => {
  const dispatch = useAppDispatch();

  // Retrieve registration state from the Redux store
  const { registration } = useAppSelector((state) => state.user);

  // Define a function for handling form submission
  const onSubmit = async (values: TInitialRegistrationFormValue): Promise<void> => {
    // Dispatch the registrationThunk action with the provided form values
    await dispatch(registrationThunk(values));
  };
  return (
    <LayoutAuth title="Գրանցվել" buttonTitle="Մուտք գործել" switchTo={EAuthMode.LOGIN}>
      <Formik
        initialValues={initialRegistrationFormValue}
        validationSchema={registrationFormSchema}
        onSubmit={(values) => onSubmit(values)}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
          <View className="p-5 w-full justify-center flex-1">
            <LabelInput label="Անուն" className="mt-5" required>
              <FieldWithError fieldName="firstname" errors={errors} touched={touched}>
                <TextInput
                  onChangeText={handleChange('firstname')}
                  onBlur={handleBlur('firstname')}
                  value={values.firstname}
                  onSubmitEditing={Keyboard.dismiss}
                  placeholder="Անուն"
                  className="rounded px-3 py-3 border border-gray-600"
                />
              </FieldWithError>
            </LabelInput>
            <LabelInput label="Ազգանուն" required>
              <FieldWithError fieldName="lastname" errors={errors} touched={touched}>
                <TextInput
                  onChangeText={handleChange('lastname')}
                  onBlur={handleBlur('lastname')}
                  value={values.lastname}
                  onSubmitEditing={Keyboard.dismiss}
                  placeholder="Ազգանուն"
                  className="rounded px-3 py-3 border border-gray-600"
                />
              </FieldWithError>
            </LabelInput>
            <LabelInput label="Էլ․ փոստ" additionalLabel="ոչ պարտադիր">
              <FieldWithError fieldName="mail" errors={errors} touched={touched}>
                <TextInput
                  onChangeText={handleChange('mail')}
                  onBlur={handleBlur('mail')}
                  onSubmitEditing={Keyboard.dismiss}
                  placeholder="Էլ․ փոստ"
                  value={values.mail}
                  className="rounded px-3 py-3 border border-gray-600"
                />
              </FieldWithError>
            </LabelInput>
            <LabelInput label="Մուտքանուն" required>
              <FieldWithError fieldName="username" errors={errors} touched={touched}>
                <TextInput
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  value={values.username}
                  onSubmitEditing={Keyboard.dismiss}
                  placeholder="Մուտքանուն"
                  className="rounded px-3 py-3 border border-gray-600"
                />
              </FieldWithError>
            </LabelInput>
            <LabelInput label="Հասցե" required>
              <FieldWithError fieldName="address" errors={errors} touched={touched}>
                <TextInput
                  onChangeText={handleChange('address')}
                  onBlur={handleBlur('address')}
                  value={values.address}
                  onSubmitEditing={Keyboard.dismiss}
                  placeholder="Հասցե"
                  className="rounded px-3 py-3 border border-gray-600"
                />
              </FieldWithError>
            </LabelInput>
            <LabelInput label="Հեռախոսահամար" required>
              <FieldWithError fieldName="phone" errors={errors} touched={touched}>
                <MaskInput
                  className="rounded px-3 py-3 border border-gray-600"
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
            </LabelInput>
            <LabelInput label="Գաղտնաբառ" required>
              <FieldWithError fieldName="password" errors={errors} touched={touched}>
                <TextInput
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  onSubmitEditing={Keyboard.dismiss}
                  placeholder="Գաղտնաբառ"
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
                  placeholder="Կրկնել գաղտնաբառը"
                  className="rounded px-3 py-3 border border-gray-600"
                  secureTextEntry
                />
              </FieldWithError>
            </LabelInput>
            <View>
              <SignButton
                handleSubmit={handleSubmit}
                isLoading={registration.isLoading ?? false}
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
