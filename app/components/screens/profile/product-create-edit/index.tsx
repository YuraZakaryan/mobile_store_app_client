import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { NavigationProp, ParamListBase, useNavigation, useRoute } from '@react-navigation/native';
import { FormikValues } from 'formik';
import React from 'react';
import { Image, Keyboard, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { SelectList } from 'react-native-dropdown-select-list';

import { TInitialProductCreateEditFormValue, TProductCreateEditRouteParams } from './types';
import { ICON_MAIN_COLOR } from '../../../../utils/constants';
import { pickImageSetFormik } from '../../../../utils/image';
import { CreateEditForm, LabelInput, Main } from '../../../wrappers';

export const ProductCreateEdit = () => {
  const route = useRoute();
  const { item }: TProductCreateEditRouteParams =
    (route.params as TProductCreateEditRouteParams) || {};
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  React.useLayoutEffect((): void => {
    navigation.setOptions({
      headerTitle: item ? item.title : 'Ստեղծել ապրանք',
    });
  }, [item]);

  const initialProductCreateEditFormValue: TInitialProductCreateEditFormValue = {
    title: item?.title || '',
    price: item?.price || 0,
    discount: item?.discount || 0,
    code: item?.code || 0,
    picture: item?.picture || null,
    category: item?.category || '',
  };

  const clearPicture = (setFieldValue: FormikValues['setFieldValue']) => {
    setFieldValue('picture', null);
  };

  const data = [
    { key: '1', value: 'Mobiles' },
    { key: '2', value: 'Appliances' },
    { key: '3', value: 'Cameras' },
    { key: '4', value: 'Computers' },
    { key: '5', value: 'Vegetables' },
    { key: '6', value: 'Diary Products' },
    { key: '7', value: 'Drinks' },
  ];
  const handleSelectChange = (value: string, setFieldValue: FormikValues['setFieldValue']) => {
    setFieldValue('category', value);
  };

  const handleClick = (values: TInitialProductCreateEditFormValue) => {
    alert(values.category);
  };

  return (
    <Main>
      <ScrollView>
        <CreateEditForm
          initialCreateEditFormValue={initialProductCreateEditFormValue}
          icon={
            <MaterialIcons
              name="category"
              size={85}
              style={{
                color: ICON_MAIN_COLOR,
              }}
            />
          }
          item={item}
          label="ապրանք"
          renderItemComponent={(values, handleChange, handleBlur, handleSubmit, setFieldValue) => (
            <>
              <LabelInput label="Անվանում" className="mt-5">
                <TextInput
                  onChangeText={handleChange('title')}
                  onBlur={handleBlur('title')}
                  onSubmitEditing={Keyboard.dismiss}
                  placeholder="Անվանում"
                  value={values.title}
                  className="rounded p-3 border border-gray-600"
                />
              </LabelInput>
              <LabelInput label="Կատեգորիա">
                <SelectList
                  setSelected={(val: string) => handleSelectChange(val, setFieldValue)}
                  data={data}
                  save="value"
                  boxStyles={{
                    borderRadius: 4,
                    borderColor: 'black',
                    paddingLeft: 12,
                    paddingRight: 12,
                  }}
                  dropdownStyles={{
                    borderRadius: 4,
                  }}
                />
              </LabelInput>
              <LabelInput
                label="Գին"
                icon={<Text className="text-gray-500 text-[12px] font-bold">դրամ</Text>}>
                <TextInput
                  onChangeText={handleChange('price')}
                  onBlur={handleBlur('price')}
                  onSubmitEditing={Keyboard.dismiss}
                  placeholder="Գին"
                  keyboardType="number-pad"
                  value={values.price.toString()}
                  className="rounded p-3 border border-gray-600"
                />
              </LabelInput>

              <LabelInput label="Զեղչ" icon={<FontAwesome name="percent" size={12} color="gray" />}>
                <TextInput
                  onChangeText={handleChange('discount')}
                  onBlur={handleBlur('discount')}
                  onSubmitEditing={Keyboard.dismiss}
                  placeholder="Զեղչ"
                  keyboardType="number-pad"
                  value={values.discount.toString()}
                  className="rounded p-3 border border-gray-600"
                />
              </LabelInput>
              <LabelInput label="Կոդ">
                <TextInput
                  onChangeText={handleChange('code')}
                  onBlur={handleBlur('code')}
                  onSubmitEditing={Keyboard.dismiss}
                  placeholder="Կոդ"
                  keyboardType="number-pad"
                  value={values.code.toString()}
                  className="rounded p-3 border border-gray-600"
                />
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
                          source={{ uri: values.picture ?? '' }}
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
              <TouchableOpacity
                className="p-4 bg-orange-400 rounded mt-5"
                onPress={() => handleClick(values)}>
                <Text className="text-center font-bold text-white">
                  {item ? 'Պահպանել' : 'Ստեղծել'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        />
      </ScrollView>
    </Main>
  );
};
