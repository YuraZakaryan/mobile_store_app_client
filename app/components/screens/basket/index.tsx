import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import NumericInput from 'react-native-numeric-input';
import Toast from 'react-native-toast-message';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { setNecessaryNotes, setPackaging } from '../../../redux/reducers/basket/basketSlice';
import { EPacking, IBasketItem } from '../../../redux/types';
import { Main } from '../../wrappers';

export const Basket = () => {
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector((state) => state.basket);

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Hello',
      text2: 'This is some something 👋',
    });
  };

  const sumItemsPrice: number = formData.items.reduce((acc, cur) => {
    return acc + cur.price;
  }, 0);
  const handleChangePackagingType = (typePackaging: EPacking): void => {
    dispatch(setPackaging(typePackaging));
  };

  const handleChangeNotes = (text: string): void => {
    dispatch(setNecessaryNotes(text));
  };

  const handleClick = (): void => {
    showToast();
  };

  return (
    <Main>
      <ScrollView>
        <View className="w-full p-4 gap-6">
          <View className="w-full">
            <FlatList
              data={formData.items}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              renderItem={({ item }) => (
                <View
                  key={item._id}
                  className="flex-row flex-1 min-h-[140px] bg-white shadow rounded-lg relative">
                  <View className="absolute right-2 top-2">
                    <FontAwesome name="window-close" size={23} color="red" />
                  </View>
                  <View>
                    <Image
                      source={require('./../../../assets/images/products/iphone.png')}
                      className="w-24 h-24 rounded-lg"
                      alt={item.title}
                    />
                  </View>
                  <View className="m-3 justify-between">
                    <View>
                      <Text className="text-blue-600">{item.title}</Text>
                    </View>
                    <View className="gap-1">
                      <Text className="text-gray-600">Կոդ։ {item.code}</Text>
                      <Text className="text-orange-500 font-semibold mt-2">Գին։ {item.price}</Text>
                      <View>
                        <NumericInput
                          onChange={(value) => console.log(value)}
                          totalWidth={100}
                          type="plus-minus"
                          valueType="real"
                          rounded
                          totalHeight={25}
                          value={item.orderCount}
                          minValue={0}
                          maxValue={99}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              )}
              horizontal={false}
              keyExtractor={(item: IBasketItem) => item._id}
            />
          </View>
          <View className="bg-white flex-row justify-between p-4 items-center w-full rounded-lg">
            <Text className="text-lg text-gray-400">Ընդհանուր</Text>
            <Text>{sumItemsPrice} ․դր</Text>
          </View>
          <View className="w-full items-center">
            <View>
              <Text className="text-lg text-gray-400">Փաթեթավորման տեսակը</Text>
            </View>
            <View className="flex-row rounded-lg shadow bg-white mt-3">
              <TouchableOpacity
                className={`items-center justify-center py-2 min-w-[160px]${
                  formData.packaging === EPacking.BAG ? ' bg-orange-400 rounded-lg' : ''
                }`}
                onPress={() => handleChangePackagingType(EPacking.BAG)}>
                <Text
                  className={`text-base text-gray-500${
                    formData.packaging === EPacking.BAG ? ' text-black' : ''
                  }`}>
                  Տոպրակ
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`items-center justify-center py-2 min-w-[160px]${
                  formData.packaging === EPacking.BOX ? ' bg-orange-400 rounded-lg' : ''
                }`}
                onPress={() => handleChangePackagingType(EPacking.BOX)}>
                <Text
                  className={`text-base text-gray-500${
                    formData.packaging === EPacking.BOX ? ' text-black' : ''
                  }`}>
                  Արկղ
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-1 w-full items-center mt-3">
              <Text className="text-lg text-gray-400">Անհրաժեշտ նշումներ</Text>
              <View className="w-full rounded-lg overflow-hidden mt-3">
                <TextInput
                  className="bg-white w-full px-2 py-3 text-base"
                  value={formData.necessaryNotes}
                  onChangeText={(text: string) => handleChangeNotes(text)}
                />
              </View>
            </View>
            <View className="w-full mt-6">
              <TouchableOpacity
                className="p-4 items-center rounded-lg bg-orange-400"
                onPress={handleClick}>
                <Text className="text-white text-base font-semibold">Պատվիրել</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </Main>
  );
};
