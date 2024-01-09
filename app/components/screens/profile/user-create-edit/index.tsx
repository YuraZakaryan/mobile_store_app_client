import { FontAwesome } from '@expo/vector-icons';
import { NavigationProp, ParamListBase, useNavigation, useRoute } from '@react-navigation/native';
import { FormikValues } from 'formik';
import React from 'react';
import { Keyboard, Text, TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import MaskInput from 'react-native-mask-input';

import { TInitialUserCreateEditFormValue, TUserCreateEditRouteParams } from './types';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { createUserThunk, updateUserThunk } from '../../../../redux/http/userThunk';
import { selectRoles } from '../../../../utils';
import { ICON_MAIN_COLOR } from '../../../../utils/constants';
import { registrationFormSchema, updateUserFormSchema } from '../../../../validation';
import {
  CreateEditForm,
  CrudButtonGroup,
  FieldWithError,
  LabelInput,
  Main,
} from '../../../wrappers';
import { CrudMainButton } from '../../../wrappers/crud-main-button';

export const UserCreateEdit = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);
  const route = useRoute();
  const { createUser, updateUser } = useAppSelector((state) => state.user);
  const { item, isUser }: TUserCreateEditRouteParams =
    (route.params as TUserCreateEditRouteParams) || {};
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
    address: item?.address || '',
    password: '',
    phone: item?.phone || '',
    role: item?.role || 'USER',
    confirmed: !item?.confirmed ? true : item?.confirmed || false,
  };

  const handleSelectChange = (value: string, setFieldValue: FormikValues['setFieldValue']) => {
    setFieldValue('role', value);
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
        label={isUser ? 'անձնական տվյալները' : 'հաճախորդ'}
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
            setFieldValue,
          } = formikProps;
          return (
            <>
              <LabelInput label="Անուն" className="mt-5" required>
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
              <LabelInput label="Ազգանուն" required>
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
              <LabelInput label="Մուտքանուն" required>
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
              <LabelInput label="Հասցե" required>
                <FieldWithError fieldName="address" errors={errors} touched={touched}>
                  <TextInput
                    onChangeText={handleChange('address')}
                    onBlur={handleBlur('address')}
                    onSubmitEditing={Keyboard.dismiss}
                    placeholder="Հասցե"
                    value={values.address}
                    className="rounded px-3 py-3 border border-gray-600"
                  />
                </FieldWithError>
              </LabelInput>
              <LabelInput label="Հեռախոսահամար" required>
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
                  <LabelInput label="Գաղտնաբառ" required>
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
                </>
              ) : null}
              {!isUser && (
                <LabelInput label="Պարտականությունը" required>
                  <DropDownPicker
                    open={open}
                    value={values.role}
                    items={selectRoles}
                    setOpen={setOpen}
                    style={{
                      borderRadius: 4,
                      borderColor: 'gray',
                      paddingLeft: 12,
                      paddingRight: 12,
                      backgroundColor: 'transparent',
                    }}
                    setValue={(val) => handleSelectChange(val(val), setFieldValue)}
                    listMode="SCROLLVIEW"
                    scrollViewProps={{
                      nestedScrollEnabled: true,
                    }}
                  />
                </LabelInput>
              )}

              <CrudButtonGroup>
                <View>
                  <CrudMainButton
                    handleSubmit={handleSubmit}
                    isLoading={createUser.isLoading || updateUser.isLoading}
                    disabled={
                      ((item?.confirmed && !isValid) as boolean) ||
                      ((item?.confirmed && !dirty) as boolean)
                    }>
                    {item ? (item.confirmed ? 'Պահպանել' : 'Հաստատել') : 'Ստեղծել'}
                  </CrudMainButton>
                </View>
                {/*{item ? (*/}
                {/*  <View>*/}
                {/*    <DeleteButton>{item && (item.confirmed ? 'Ջնջել' : 'Չեղարկել')}</DeleteButton>*/}
                {/*  </View>*/}
                {/*) : null}*/}
              </CrudButtonGroup>
            </>
          );
        }}
      />
    </Main>
  );
};
