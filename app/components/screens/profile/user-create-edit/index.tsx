import { FontAwesome } from '@expo/vector-icons';
import { NavigationProp, ParamListBase, useNavigation, useRoute } from '@react-navigation/native';
import { FormikValues } from 'formik';
import React from 'react';
import { Keyboard, TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import MaskInput from 'react-native-mask-input';

import { TInitialUserCreateEditFormValue, TUserCreateEditRouteParams } from './types';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import {
  cancelUserThunk,
  createUserThunk,
  toggleBanThunk,
  updateUserThunk,
} from '../../../../redux/http/userThunk';
import { TPayloadActionUser, TUser } from '../../../../redux/types';
import { SHOW_ERROR, SHOW_SUCCESS } from '../../../../toasts';
import { selectRoles } from '../../../../utils';
import { ICON_MAIN_COLOR, NETWORK_ERROR_MESSAGE } from '../../../../utils/constants';
import { registrationFormSchema, updateUserFormSchema } from '../../../../validation';
import {
  CreateEditForm,
  CrudButtonGroup,
  DeleteButton,
  FieldWithError,
  LabelInput,
  Main,
} from '../../../wrappers';
import { CrudMainButton } from '../../../wrappers/crud-main-button';

export const UserCreateEdit = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);
  const route = useRoute();
  const { user, createUser, updateUser, cancelUser, banUser } = useAppSelector(
    (state) => state.user
  );
  const { item, isUser }: TUserCreateEditRouteParams =
    (route.params as TUserCreateEditRouteParams) || {};
  const { setOptions, navigate } = useNavigation<NavigationProp<ParamListBase>>();

  React.useLayoutEffect((): void => {
    setOptions({
      headerTitle: item ? `${item.firstname} ${item.lastname}` : 'Ստեղծել բաժանորդ',
    });
  }, [item]);

  const initialUserCreateEditFormValue: TInitialUserCreateEditFormValue = {
    firstname: item?.firstname || '',
    lastname: item?.lastname || '',
    username: item?.username || '',
    mail: item?.mail || '',
    address: item?.address || '',
    password: '',
    phone: item?.phone || '',
    role: item?.role || 'USER',
    stockToken: item?.stockToken || '',
    confirmed: !item?.confirmed ? true : item?.confirmed || false,
  };

  const handleSelectChange = (value: string, setFieldValue: FormikValues['setFieldValue']) => {
    setFieldValue('role', value);
  };

  const onSubmit = async (values: FormikValues): Promise<void> => {
    if (item) {
      await dispatch(updateUserThunk({ id: item?._id as string, formData: values, navigate }))
        .unwrap()
        .then((res: TUser | void): void => {
          if (res && user?._id === res._id) {
            SHOW_SUCCESS('Փոփոխությունները տեսնելու համար նորից մուտք գործեք ծրագիր');
          } else {
            SHOW_SUCCESS('Հաճախորդը հաջողությամբ փոփոխվեց');
            navigate('users-control');
          }
        })
        .catch((err): void => {
          if (err === 'NetworkError') {
            SHOW_ERROR(NETWORK_ERROR_MESSAGE);
          } else if (err.toLowerCase().includes('mail already exists')) {
            SHOW_ERROR('Էլ․ փոստը զբաղված է');
          } else if (err.toLowerCase().includes('username already exists')) {
            SHOW_ERROR('Մուտքանունը զբաղված է');
          } else {
            SHOW_ERROR('Բաժանորդի տվյալների փոփոխման հետ կապված խնդիր է առաջացել');
          }
        });
    } else {
      await dispatch(createUserThunk({ formData: values, navigate }))
        .unwrap()
        .then((res: TPayloadActionUser) => res && SHOW_SUCCESS('Հաճախորդը հաջողությամբ ստեղծվեց'))
        .catch((err): void => {
          switch (err) {
            case 'mail_already_exists':
              SHOW_ERROR('Էլ․ փոստը զբաղված է');
              break;
            case 'username_already_exists':
              SHOW_ERROR('Մուտքանունը զբաղված է');
              break;
            default:
              SHOW_ERROR(NETWORK_ERROR_MESSAGE);
              break;
          }
        });
    }
  };

  const toggleBan = async (): Promise<void> => {
    await dispatch(toggleBanThunk({ _id: item?._id as string, navigate }))
      .unwrap()
      .then(
        (res) =>
          res &&
          SHOW_SUCCESS(
            `${
              res.message === 'User banned'
                ? 'Բաժանորդը հաջողությամբ ապաակտիվացվեց'
                : 'Բաժանորդը հաջողությամբ ակտիվացվեց'
            }`
          )
      )
      .catch((err): void => {
        if (err === 'NetworkError') {
          SHOW_ERROR(NETWORK_ERROR_MESSAGE);
        } else {
          SHOW_ERROR('Բաժանորդի ակտիվացման կամ ապաակտիվացման հետ կապված խնդիր է առաջացել');
        }
      });
  };

  const handleCancel = async (): Promise<void> => {
    await dispatch(cancelUserThunk({ _id: item?._id as string, navigate }))
      .unwrap()
      .then((res: string) => res && SHOW_SUCCESS('Հաճախորդը հաջողությամբ չեղարկվեց'))
      .catch((err): void => {
        if (err === 'NetworkError') {
          SHOW_ERROR(NETWORK_ERROR_MESSAGE);
        } else {
          SHOW_ERROR('Բաժանորդի չեղարկման հետ կապված խնդիր է առաջացել');
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
              <LabelInput label="Էլ․ փոստ" required>
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
              <LabelInput label="Պահոցի թոքեն" required>
                <FieldWithError fieldName="stockToken" errors={errors} touched={touched}>
                  <TextInput
                    onChangeText={handleChange('stockToken')}
                    onBlur={handleBlur('stockToken')}
                    onSubmitEditing={Keyboard.dismiss}
                    placeholder="Թոքեն"
                    value={values.stockToken}
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
                        placeholder="Գաղտնաբառ"
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
                    isLoading={(createUser.isLoading || updateUser.isLoading) ?? false}
                    disabled={!isValid || ((item?.confirmed && !dirty) as boolean)}>
                    {item ? (item.confirmed ? 'Պահպանել' : 'Հաստատել') : 'Ստեղծել'}
                  </CrudMainButton>
                </View>
                {item && user?.role === 'ADMIN' && user?._id !== item._id ? (
                  <View>
                    <DeleteButton
                      handleDelete={!item.confirmed ? handleCancel : toggleBan}
                      className={`${item.banned && 'bg-green-500'}`}
                      isLoading={(cancelUser.isLoading || banUser.isLoading) ?? false}>
                      {(item.confirmed && (!item.banned ? 'Ապաակտիվացնել' : 'Ակտիվացնել')) ||
                        'Չեղարկել'}
                    </DeleteButton>
                  </View>
                ) : null}
              </CrudButtonGroup>
            </>
          );
        }}
      />
    </Main>
  );
};
