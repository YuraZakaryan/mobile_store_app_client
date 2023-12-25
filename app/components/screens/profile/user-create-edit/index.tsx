import { FontAwesome } from '@expo/vector-icons';
import { NavigationProp, ParamListBase, useNavigation, useRoute } from '@react-navigation/native';
import { FormikValues } from 'formik';
import React from 'react';
import { Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MaskInput from 'react-native-mask-input';
import RNPickerSelect from 'react-native-picker-select';

import { TInitialUserCreateEditFormValue, TUserCreateEditRouteParams } from './types';
import { useAppDispatch } from '../../../../hooks/redux';
import { createUserThunk, updateUserThunk } from '../../../../redux/http/userThunk';
import { selectRoles } from '../../../../utils';
import { ICON_MAIN_COLOR } from '../../../../utils/constants';
import { registrationFormSchema, updateUserFormSchema } from '../../../../validation';
import { CreateEditForm, DeleteButton, FieldWithError, LabelInput, Main } from '../../../wrappers';
import { CrudMainButton } from '../../../wrappers/crud-main-button';

export const UserCreateEdit = () => {
  const dispatch = useAppDispatch();
  const route = useRoute();
  const { item }: TUserCreateEditRouteParams = (route.params as TUserCreateEditRouteParams) || {};
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  React.useLayoutEffect((): void => {
    navigation.setOptions({
      headerTitle: item ? `${item.firstname} ${item.lastname}` : 'Ստեղծել բաժանորդ',
    });
  }, [item]);

  const initialUserCreateEditFormValue: TInitialUserCreateEditFormValue = {
    firstname: item?.firstname || '',
    lastname: item?.lastname || '',
    username: item?.username || '',
    password: '',
    phone: item?.phone || '',
    role: item?.role || 'USER',
    confirmed: !item?.confirmed ? true : item?.confirmed || false,
  };
  const onSubmit = async (values: FormikValues) => {
    if (item) {
      await dispatch(updateUserThunk({ id: item?._id as string, formData: values }));
    } else {
      await dispatch(createUserThunk(values));
    }
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
        item={item}
        label="հաճախորդ"
        onSubmit={onSubmit}
        validationSchema={item ? updateUserFormSchema : registrationFormSchema}
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
              <LabelInput label="Անուն" className="mt-5">
                <FieldWithError fieldName="firstname" errors={errors} touched={touched}>
                  <TextInput
                    onChangeText={handleChange('firstname')}
                    onBlur={handleBlur('firstname')}
                    onSubmitEditing={Keyboard.dismiss}
                    placeholder="Անուն"
                    value={values.firstname}
                    className="rounded px-3 py-3 border border-gray-600"
                  />
                </FieldWithError>
              </LabelInput>
              <LabelInput label="Ազգանուն">
                <FieldWithError fieldName="lastname" errors={errors} touched={touched}>
                  <TextInput
                    onChangeText={handleChange('lastname')}
                    onBlur={handleBlur('lastname')}
                    onSubmitEditing={Keyboard.dismiss}
                    placeholder="Ազգանուն"
                    value={values.lastname}
                    className="rounded px-3 py-3 border border-gray-600"
                  />
                </FieldWithError>
              </LabelInput>
              <LabelInput label="Մուտքանուն">
                <FieldWithError fieldName="username" errors={errors} touched={touched}>
                  <TextInput
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    onSubmitEditing={Keyboard.dismiss}
                    placeholder="Մուտքանուն"
                    value={values.username}
                    className="rounded px-3 py-3 border border-gray-600"
                  />
                </FieldWithError>
              </LabelInput>
              <LabelInput label="Հեռախոսահամար">
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
              </LabelInput>
              {!item ? (
                <>
                  <LabelInput label="Գաղտնաբառ">
                    <FieldWithError fieldName="password" errors={errors} touched={touched}>
                      <TextInput
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        onSubmitEditing={Keyboard.dismiss}
                        placeholder="Մուտքանուն"
                        value={values.password}
                        secureTextEntry
                        className="rounded px-3 py-3 border border-gray-600"
                      />
                    </FieldWithError>
                  </LabelInput>
                  <LabelInput label="Գաղտնաբառ">
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
                </>
              ) : null}
              <RNPickerSelect
                onValueChange={(value) => handleChange('role')(value)}
                value={values.role}
                items={selectRoles}
              />
              <View>
                <CrudMainButton
                  handleSubmit={handleSubmit}
                  disabled={
                    ((item?.confirmed && !isValid) as boolean) ||
                    ((item?.confirmed && !dirty) as boolean)
                  }>
                  {item ? (item.confirmed ? 'Պահպանել' : 'Հաստատել') : 'Ստեղծել'}
                </CrudMainButton>
              </View>
              {item ? (
                <View>
                  <DeleteButton>{item && (item.confirmed ? 'Ջնջել' : 'Չեղարկել')}</DeleteButton>
                </View>
              ) : null}
            </>
          );
        }}
      />
    </Main>
  );
};
