import { FontAwesome } from '@expo/vector-icons';
import { NavigationProp, ParamListBase, useNavigation, useRoute } from '@react-navigation/native';
import { FormikValues } from 'formik';
import React from 'react';
import { Image, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import { TInitialProductCreateEditFormValue, TProductCreateEditRouteParams } from './types';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import {
  createProductThunk,
  deleteProductThunk,
  updateProductThunk,
} from '../../../../redux/http/productThunk';
import { TCategory } from '../../../../redux/types';
import { SHOW_ERROR, SHOW_SUCCESS } from '../../../../toasts';
import { API_URL, ICON_MAIN_COLOR, NETWORK_ERROR_MESSAGE } from '../../../../utils/constants';
import { pickImageSetFormik } from '../../../../utils/image';
import { createAndEditProductFormSchema } from '../../../../validation';
import {
  CreateEditForm,
  CrudButtonGroup,
  DeleteButton,
  FieldWithError,
  LabelInput,
  Main,
} from '../../../wrappers';
import { CrudMainButton } from '../../../wrappers/crud-main-button';

export const ProductCreateEdit = () => {
  const dispatch = useAppDispatch();
  const route = useRoute();
  const { item }: TProductCreateEditRouteParams =
    (route.params as TProductCreateEditRouteParams) || {};
  const { setOptions, navigate } = useNavigation<NavigationProp<ParamListBase>>();

  const [open, setOpen] = React.useState(false);
  const { user } = useAppSelector((state) => state.user);
  const { categories } = useAppSelector((state) => state.category);
  const { delete: deleteStatus, create, update } = useAppSelector((state) => state.product);

  const categoryData = categories.items.map((category: TCategory) => ({
    key: category._id,
    label: category.title,
    value: category._id,
  }));

  React.useLayoutEffect((): void => {
    setOptions({
      headerTitle: item ? item.title : 'Ստեղծել ապրանք',
    });
  }, [item]);

  const initialProductCreateEditFormValue: TInitialProductCreateEditFormValue = {
    title: item?.title || '',
    information: item?.information || '',
    price: item?.price || null,
    count: item?.count || null,
    discount: item?.discount || 0,
    code: item?.code || '',
    picture: item?.picture || null,
    category: item?.category || categoryData[0].value,
    author: user?._id as string,
  };
  const clearPicture = (setFieldValue: FormikValues['setFieldValue']): void => {
    setFieldValue('picture', null);
  };

  const handleSelectChange = (
    value: string,
    setFieldValue: FormikValues['setFieldValue']
  ): void => {
    setFieldValue('category', value);
  };

  const onSubmit = async (values: FormikValues): Promise<void> => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('information', values.information);
    formData.append('price', values.price);
    formData.append('count', values.count);
    formData.append('discount', values.discount);
    formData.append('code', values.code);
    formData.append('category', values.category);
    formData.append('author', values.author);

    if (values.picture) {
      formData.append('picture', values.picture);
    }
    if (item) {
      await dispatch(updateProductThunk({ id: item?._id as string, formData }))
        .unwrap()
        .then((res) => res && SHOW_SUCCESS('Ապրանքը հաջողությամբ փոփոխվեց'))
        .catch((err): void => {
          if (err === 'NetworkError') {
            SHOW_ERROR(NETWORK_ERROR_MESSAGE);
          } else if (err === 403) {
            SHOW_ERROR('Դուք չունեք բավարար իրավունքներ');
          } else {
            SHOW_ERROR('Ապրանքի փոփոխման հետ կապված խնդիր է առաջացել');
          }
        });
    } else {
      await dispatch(createProductThunk({ formData, navigate }))
        .unwrap()
        .then((res) => res && SHOW_SUCCESS('Ապրանքը հաջողությամբ ստեղծվեց'))
        .catch((err): void => {
          if (err === 'NetworkError') {
            SHOW_ERROR(NETWORK_ERROR_MESSAGE);
          } else if (err === 403) {
            SHOW_ERROR('Դուք չունեք բավարար իրավունքներ');
          } else {
            SHOW_ERROR('Ապրանքի ստեղծման հետ կապված խնդիր է առաջացել');
          }
        });
    }
  };
  const handleDelete = async (): Promise<void> => {
    await dispatch(deleteProductThunk({ _id: item?._id as string, navigate }))
      .unwrap()
      .then((res: string) => res && SHOW_SUCCESS('Ապրանքը հաջողությամբ ջնջվեց'))
      .catch((err): void => {
        if (err === 'NetworkError') {
          SHOW_ERROR(NETWORK_ERROR_MESSAGE);
        } else if (err === 403) {
          SHOW_ERROR('Դուք չունեք բավարար իրավունքներ');
        } else {
          SHOW_ERROR('Ապրանքի ջնջման հետ կապված խնդիր է առաջացել');
        }
      });
  };

  return (
    <Main>
      <CreateEditForm
        initialCreateEditFormValue={initialProductCreateEditFormValue}
        icon={
          <FontAwesome
            name="product-hunt"
            size={85}
            style={{
              color: ICON_MAIN_COLOR,
            }}
          />
        }
        onSubmit={onSubmit}
        item={item}
        label="ապրանք"
        validationSchema={createAndEditProductFormSchema}
        renderItemComponent={(formikProps) => {
          const {
            errors,
            dirty,
            touched,
            values,
            handleChange,
            handleBlur,
            setFieldValue,
            isValid,
            handleSubmit,
          } = formikProps;
          return (
            <>
              <LabelInput label="Անվանում" className="mt-5" required>
                <FieldWithError fieldName="title" errors={errors} touched={touched}>
                  <TextInput
                    onChangeText={handleChange('title')}
                    onBlur={handleBlur('title')}
                    onSubmitEditing={Keyboard.dismiss}
                    placeholder="Անվանում"
                    value={values.title}
                    className="rounded px-3 py-3 border border-gray-600"
                  />
                </FieldWithError>
              </LabelInput>
              <LabelInput label="Ինֆորմացիա">
                <FieldWithError fieldName="information" errors={errors} touched={touched}>
                  <TextInput
                    onChangeText={handleChange('information')}
                    onBlur={handleBlur('information')}
                    onSubmitEditing={Keyboard.dismiss}
                    placeholder="Ինֆորմացիա"
                    value={values.information}
                    className="rounded px-3 py-3 border border-gray-600"
                  />
                </FieldWithError>
              </LabelInput>
              <LabelInput label="Կատեգորիա" required>
                <DropDownPicker
                  open={open}
                  value={values.category}
                  items={categoryData}
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
              <LabelInput
                label="Գինը"
                required
                icon={<Text className="text-gray-500 text-[12px] font-bold">դրամ</Text>}>
                <FieldWithError fieldName="price" errors={errors} touched={touched}>
                  <TextInput
                    onChangeText={handleChange('price')}
                    onBlur={handleBlur('price')}
                    onSubmitEditing={Keyboard.dismiss}
                    placeholder="Գին"
                    keyboardType="number-pad"
                    value={values.price?.toString()}
                    className="rounded p-3 border border-gray-600"
                  />
                </FieldWithError>
              </LabelInput>
              <LabelInput label="Զեղչ" icon={<FontAwesome name="percent" size={12} color="gray" />}>
                <FieldWithError fieldName="discount" errors={errors} touched={touched}>
                  <TextInput
                    onChangeText={handleChange('discount')}
                    onBlur={handleBlur('discount')}
                    onSubmitEditing={Keyboard.dismiss}
                    placeholder="Զեղչ"
                    keyboardType="number-pad"
                    value={values.discount.toString()}
                    className="rounded p-3 border border-gray-600"
                  />
                </FieldWithError>
              </LabelInput>
              <LabelInput label="Քանակը" required>
                <FieldWithError fieldName="count" errors={errors} touched={touched}>
                  <TextInput
                    onChangeText={handleChange('count')}
                    onBlur={handleBlur('count')}
                    onSubmitEditing={Keyboard.dismiss}
                    placeholder="Քանակը"
                    keyboardType="number-pad"
                    value={values.count?.toString()}
                    className="rounded p-3 border border-gray-600"
                  />
                </FieldWithError>
              </LabelInput>
              <LabelInput label="Կոդ" required>
                <FieldWithError fieldName="code" errors={errors} touched={touched}>
                  <TextInput
                    onChangeText={handleChange('code')}
                    onBlur={handleBlur('code')}
                    onSubmitEditing={Keyboard.dismiss}
                    placeholder="Կոդ"
                    keyboardType="number-pad"
                    value={values.code.toString()}
                    className="rounded p-3 border border-gray-600"
                  />
                </FieldWithError>
              </LabelInput>
              <View className="items-center p-5 border-dashed border-orange-500 border-2 rounded">
                {values.picture ? (
                  <View className="relative w-full h-[130px] ">
                    <TouchableOpacity
                      className="absolute right-2 -top-2 z-50"
                      onPress={() => clearPicture(setFieldValue)}>
                      <FontAwesome name="window-close" size={25} color="red" />
                    </TouchableOpacity>
                    <View className="h-full w-full justify-center items-center">
                      {values.picture && (
                        <Image
                          source={{
                            uri:
                              typeof values.picture === 'object'
                                ? (values.picture as { uri: string })?.uri
                                : values.picture.includes('file')
                                  ? values.picture
                                  : `${API_URL}/${values.picture}` ?? '',
                          }}
                          className="w-36 h-36 rounded"
                        />
                      )}
                    </View>
                  </View>
                ) : (
                  <View className="items-center">
                    <Text className="font-bold text-lg text-orange-400">Ընրտել նկար</Text>
                    <TouchableOpacity
                      className="py-2 px-16 bg-orange-400 mt-2 rounded"
                      onPress={() => pickImageSetFormik(setFieldValue, 'picture')}>
                      <Text className="text-white font-semibold">Ընտրել</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <CrudButtonGroup>
                <View>
                  <CrudMainButton
                    handleSubmit={handleSubmit}
                    disabled={!isValid || !dirty}
                    isLoading={(update.isLoading || create.isLoading) ?? false}>
                    {item ? 'Պահպանել' : 'Ստեղծել'}
                  </CrudMainButton>
                </View>
                {item ? (
                  <View>
                    <DeleteButton
                      handleDelete={handleDelete}
                      isLoading={deleteStatus.isLoading ?? false}>
                      Ջնջել
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
