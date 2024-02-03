import { FontAwesome } from '@expo/vector-icons';
import { FormikValues } from 'formik';
import React from 'react';
import { Keyboard, TextInput, View } from 'react-native';

import { TInitialPasswordChangeFormValue } from './types';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { updatePasswordThunk } from '../../../../redux/http/userThunk';
import { SHOW_ERROR, SHOW_SUCCESS } from '../../../../toasts';
import { ICON_MAIN_COLOR, NETWORK_ERROR_MESSAGE } from '../../../../utils/constants';
import { changePasswordFormSchema } from '../../../../validation';
import {
  CreateEditForm,
  CrudButtonGroup,
  FieldWithError,
  LabelInput,
  Main,
} from '../../../wrappers';
import { CrudMainButton } from '../../../wrappers/crud-main-button';

export const UserPasswordEdit = () => {
  const dispatch = useAppDispatch();
  const { user, updatePassword } = useAppSelector((state) => state.user);

  const initialUserCreateEditFormValue: TInitialPasswordChangeFormValue = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const onSubmit = async (values: FormikValues): Promise<void> => {
    await dispatch(updatePasswordThunk({ id: user?._id as string, formData: values }))
      .unwrap()
      .then((res: string) => res && SHOW_SUCCESS('Գաղտնաբառը հաջողությամբ փոխվեց'))
      .catch((err): void => {
        if (err === 'NetworkError') {
          SHOW_ERROR(NETWORK_ERROR_MESSAGE);
        } else if (err === 400) {
          SHOW_ERROR('Հին գաղտնաբառը սխալ է');
        }
      });
  };

  return (
    <Main>
      <CreateEditForm
        initialCreateEditFormValue={initialUserCreateEditFormValue}
        icon={
          <FontAwesome
            name="user"
            size={85}
            style={{
              color: ICON_MAIN_COLOR,
            }}
          />
        }
        label="գաղտնաբառը"
        onSubmit={onSubmit}
        validationSchema={changePasswordFormSchema}
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
              <LabelInput label="Հին գաղտնաբառ" required>
                <FieldWithError fieldName="oldPassword" errors={errors} touched={touched}>
                  <TextInput
                    onChangeText={handleChange('oldPassword')}
                    onBlur={handleBlur('oldPassword')}
                    onSubmitEditing={Keyboard.dismiss}
                    placeholder="Հին գաղտնաբառ"
                    value={values.oldPassword}
                    secureTextEntry
                    className="rounded px-3 py-3 border border-gray-600"
                  />
                </FieldWithError>
              </LabelInput>
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
              <CrudButtonGroup>
                <View>
                  <CrudMainButton
                    handleSubmit={handleSubmit}
                    isLoading={updatePassword.isLoading ?? false}
                    disabled={(!dirty || !isValid || updatePassword.isLoading) ?? false}>
                    Փոխել
                  </CrudMainButton>
                </View>
              </CrudButtonGroup>
            </>
          );
        }}
      />
    </Main>
  );
};
