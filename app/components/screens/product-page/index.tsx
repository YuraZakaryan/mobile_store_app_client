import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import NumericInput from 'react-native-numeric-input';
import Toast from 'react-native-toast-message';

import { ETypeInfo, TProductRouteParams } from './types';
import { InfoItem } from './wrapper';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { changeForm, setProductId } from '../../../redux/reducers/basket/basketSlice';

export const ProductPage = () => {
  const navigation = useNavigation<NavigationProp<any, any>>();
  const dispatch = useAppDispatch();
  const route = useRoute();
  const { item }: TProductRouteParams = route.params as TProductRouteParams;
  const { newItemForm } = useAppSelector((state) => state.basket);

  React.useLayoutEffect((): void => {
    navigation.setOptions({
      headerTitle: item.title,
    });
  }, []);

  React.useEffect((): void => {
    dispatch(setProductId({ _id: item._id, title: item.title }));
  }, [item._id]);

  const handleChange = (name: string, value: string | number | null) => {
    dispatch(changeForm({ name, value }));
  };

  const showToast = (): void => {
    Toast.show({
      type: 'success',
      text1: newItemForm.title || '',
      text2: 'Հաջողությամբ ավելացվեց զամբյուղի մեջ 👋',
    });
  };

  const handleClick = (): void => {
    showToast();
  };

  const isButtonDisable: boolean = newItemForm.count === 0;

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="p-4 gap">
          <View className="overflow-hidden w-full items-center">
            <Image
              source={require('./../../../assets/images/products/iphone.png')}
              className="w-60 h-60 rounded-lg"
              alt="picture"
            />
          </View>
          <View className="w-full mt-4">
            <View className="bg-white flex-row items-center justify-between border border-gray-200 mb-1 rounded-lg">
              <Text className="text-gray-500 p-4">Քանակը</Text>
              <View className="px-4">
                <NumericInput
                  onChange={(value) => handleChange('count', value)}
                  totalWidth={120}
                  type="plus-minus"
                  valueType="real"
                  rounded
                  totalHeight={35}
                  minValue={0}
                  maxValue={99}
                />
              </View>
            </View>
            <InfoItem label="Անվանում" content={item.title} />
            <InfoItem label="Կոդ" content={item.code} />
            <InfoItem label="Գին" content={item.price} type={ETypeInfo.PRICE} />
          </View>
          <View className="w-full flex-1 justify-center mt-5 items-center">
            <TouchableOpacity
              className={`bg-orange-600 p-4 w-5/6 rounded-lg${
                isButtonDisable ? ' bg-gray-400' : ''
              }`}
              onPress={handleClick}
              disabled={isButtonDisable}>
              <Text className="text-center text-white font-bold text-base">
                Ավելացնել զամբյուղում
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
