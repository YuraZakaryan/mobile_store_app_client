import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { NavigationProp, ParamListBase, useNavigation, useRoute } from '@react-navigation/native';
import { FormikValues } from 'formik';
import React from 'react';
import { Image, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import {
  createCategoryThunk,
  deleteCategoryThunk,
  updateCategoryThunk,
  updateProductsCategoryByKeywordThunk,
} from '../../../../redux/http/categoryThunk';
import { TCategory } from '../../../../redux/types';
import { SHOW_ERROR, SHOW_SUCCESS } from '../../../../toasts';
import { API_URL, ICON_MAIN_COLOR, NETWORK_ERROR_MESSAGE } from '../../../../utils/constants';
import { pickImageSetFormik } from '../../../../utils/image';
import { createAndEditCategoryFormSchema } from '../../../../validation';
import {
  CreateEditForm,
  CrudButtonGroup,
  DeleteButton,
  FieldWithError,
  LabelInput,
  Main,
} from '../../../wrappers';
import { CrudMainButton } from '../../../wrappers/crud-main-button';
import { TCategoryCreateEditRouteParams, TInitialCategoryCreateEditFormValue } from './types';

export const CategoryCreateEdit = () => {
  const dispatch = useAppDispatch();
  const route = useRoute();
  const { item }: TCategoryCreateEditRouteParams =
    (route.params as TCategoryCreateEditRouteParams) || {};
  const { setOptions, navigate } = useNavigation<NavigationProp<ParamListBase>>();

  const [categoryKeyword, setCategoryKeyword] = React.useState(item?.keyword || '');
  const { user } = useAppSelector((state) => state.user);
  const {
    delete: deleteStatus,
    create,
    update,
    updateProductsCategoryByKeyword,
  } = useAppSelector((state) => state.category);

  React.useLayoutEffect((): void => {
    setOptions({
      headerTitle: item ? item.title : 'Ստեղծել կատեգորիա',
    });
  }, [item]);

  const initialCategoryCreateEditFormValue: TInitialCategoryCreateEditFormValue = {
    title: item?.title || '',
    description: item?.description || '',
    picture: item?.picture || null,
    author: user?._id as string,
  };

  const clearPicture = (setFieldValue: FormikValues['setFieldValue']): void => {
    setFieldValue('picture', null);
  };

  const onUpdateProductsCategoryByKeyword = async () => {
    if (item) {
      await dispatch(
        updateProductsCategoryByKeywordThunk({
          id: item?._id as string,
          keyword: categoryKeyword,
        })
      )
        .unwrap()
        .then(
          (res) =>
            res && SHOW_SUCCESS('Ապրանքների կատեգորիան հաջողությամբ թարմացվեց,ըստ բանալինային բառի')
        )
        .catch((err) => {
          if (err === 'NetworkError') {
            SHOW_ERROR(NETWORK_ERROR_MESSAGE);
          } else if (err === 403) {
            SHOW_ERROR('Դուք չունեք բավարար իրավունքներ');
          } else if (err === 404) {
            SHOW_ERROR('Չեն հայտնաբերվել ապրանքներ տվյալ բանալինային բառով');
          } else {
            SHOW_ERROR('Կատեգորիայի փոփոխման հետ կապված խնդիր է առաջացել');
          }
        });
    }
  };

  const onSubmit = async (values: FormikValues): Promise<void> => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('author', values.author);

    if (values.picture) {
      formData.append('picture', values.picture);
    }
    if (item) {
      await dispatch(updateCategoryThunk({ id: item?._id as string, formData }))
        .unwrap()
        .then((res) => res && SHOW_SUCCESS('Կատեգորիան հաջողությամբ փոփոխվեց'))
        .catch((err) => {
          if (err === 'NetworkError') {
            SHOW_ERROR(NETWORK_ERROR_MESSAGE);
          } else if (err === 403) {
            SHOW_ERROR('Դուք չունեք բավարար իրավունքներ');
          } else {
            SHOW_ERROR('Կատեգորիայի փոփոխման հետ կապված խնդիր է առաջացել');
          }
        });
    } else {
      await dispatch(createCategoryThunk({ formData, navigate }))
        .unwrap()
        .then((res: TCategory) => res && SHOW_SUCCESS('Կատեգորիան հաջողությամբ ստեղծվեց'))
        .catch((err): void => {
          if (err === 403) {
            SHOW_ERROR('Դուք չունեք բավարար իրավունքներ');
          } else {
            SHOW_ERROR('Կատեգորիայի ստեղծման հետ կապված խնդիր է առաջացել');
          }
        });
    }
  };

  const handleDelete = async (): Promise<void> => {
    await dispatch(deleteCategoryThunk({ _id: item?._id as string, navigate }))
      .unwrap()
      .then((res: string) => res && SHOW_SUCCESS('Կատեգորիան հաջողությամբ ջնջվեց'))
      .catch((err): void => {
        if (err === 'NetworkError') {
          SHOW_ERROR(NETWORK_ERROR_MESSAGE);
        } else if (err === 409) {
          SHOW_ERROR('Հայտնաբերվել են ապրանքներ տվյալ կատեգորիայով');
        } else if (err === 403) {
          SHOW_ERROR('Դուք չունեք բավարար իրավունքներ');
        } else {
          SHOW_ERROR('Կատեգորիայի ջնջման հետ կապված խնդիր է առաջացել');
        }
      });
  };

  return (
    <Main>
      <CreateEditForm
        initialCreateEditFormValue={initialCategoryCreateEditFormValue}
        icon={
          <MaterialIcons
            name="category"
            size={85}
            style={{
              color: ICON_MAIN_COLOR,
            }}
          />
        }
        onSubmit={onSubmit}
        item={item}
        label="կատեգորիա"
        validationSchema={createAndEditCategoryFormSchema}
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
              <LabelInput label="Նկարագրություն">
                <FieldWithError fieldName="description" errors={errors} touched={touched}>
                  <TextInput
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                    onSubmitEditing={Keyboard.dismiss}
                    placeholder="Նկարագրություն"
                    value={values.description}
                    className="rounded px-3 py-3 border border-gray-600"
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
                                  : `${API_URL}/${values.picture}` || '',
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
              {item ? (
                <View className="mt-5 bg-white px-2 py-3 rounded-lg">
                  <Text className="text-center font-bold text-base">
                    Սիխրոնիզացնել ապրանքները ըստ համապատասխան բանալինային բառի
                  </Text>
                  <View className="py-3">
                    <TextInput
                      onChangeText={(text: string) => setCategoryKeyword(text)}
                      onSubmitEditing={Keyboard.dismiss}
                      placeholder="Բանալի բառ"
                      value={categoryKeyword}
                      className="rounded px-3 py-3 border border-gray-600"
                    />
                  </View>
                  <CrudMainButton
                    handleSubmit={onUpdateProductsCategoryByKeyword}
                    disabled={categoryKeyword.length < 3}
                    isLoading={updateProductsCategoryByKeyword.isLoading || false}>
                    Սիխրոնիզացնել ապրանքները
                  </CrudMainButton>
                </View>
              ) : null}
            </>
          );
        }}
      />
    </Main>
  );
};
