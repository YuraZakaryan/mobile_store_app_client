import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import NumericInput from 'react-native-numeric-input';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  deleteOrderItemThunk,
  getOrderByUserInProgressThunk,
  toOrderThunk,
} from '../../../redux/http/orderThunk';
import {
  setNecessaryNotes,
  setPackaging,
  updateItemCount,
} from '../../../redux/reducers/order/orderSlice';
import { EPackage, TOrderItem } from '../../../redux/types/order';
import { API_URL } from '../../../utils/constants';
import { calculateDiscountedPrice, formattedPrice } from '../../../utils/product';
import { EmptyOrder, Loading } from '../../ui';
import { Main } from '../../wrappers';

export const Basket = () => {
  const dispatch = useAppDispatch();
  const { basket, fetchBasketOrder, toOrder, create } = useAppSelector((state) => state.order);
  const { user } = useAppSelector((state) => state.user);
  const isLoading: boolean = create.isLoading;

  const fetchData = (): void => {
    dispatch(getOrderByUserInProgressThunk(user?._id as string));
  };
  React.useEffect((): void => {
    fetchData();
  }, [isLoading]);

  const sumItemsPrice: number = basket.items.reduce((acc, item) => {
    if (item.product && item.product.price) {
      const itemPrice = item.product.discount
        ? calculateDiscountedPrice(item.product.price, item.product.discount)
        : item.product.price;
      return acc + itemPrice * item.itemCount;
    }
    return acc;
  }, 0);

  const handleChangePackagingType = (typePackaging: EPackage): void => {
    dispatch(setPackaging(typePackaging));
  };

  const handleChangeNotes = (text: string): void => {
    dispatch(setNecessaryNotes(text));
  };

  const handleDelete = (_id: string): void => {
    dispatch(deleteOrderItemThunk(_id));
  };

  const handleClick = (): void => {
    dispatch(toOrderThunk(basket));
  };

  const handleRefresh = (): void => {
    fetchData();
  };
  return (
    <Main>
      {fetchBasketOrder.isLoading ? (
        <Loading />
      ) : !basket.items.length || basket.items.length === 0 ? (
        <EmptyOrder text="Զամբյուղը դատարկ է" />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={fetchBasketOrder.isLoading} onRefresh={handleRefresh} />
          }>
          <View className="w-full p-4 gap-6">
            <View className="w-full">
              <FlatList
                data={basket.items}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                renderItem={({ item }) => (
                  <>
                    {item.product && (
                      <View className="flex-row flex-1 min-h-[140px] bg-white shadow rounded-lg relative">
                        <TouchableOpacity
                          className="absolute right-2 top-2"
                          onPress={() => handleDelete(item._id)}>
                          <FontAwesome name="window-close" size={23} color="red" />
                        </TouchableOpacity>
                        <View>
                          {item.product && item.product.picture && (
                            <Image
                              source={{ uri: API_URL + '/' + item.product.picture }}
                              className="w-24 h-24 rounded-lg"
                              alt={item.product.title}
                            />
                          )}
                        </View>
                        <View className="m-3 justify-between">
                          <View>
                            {item.product && (
                              <Text className="text-blue-600">{item.product.title}</Text>
                            )}
                          </View>
                          <View className="gap-1">
                            {item.product && (
                              <Text className="text-gray-600">Կոդ։ {item.product.code}</Text>
                            )}
                            <View className="flex-row items-center mt-2 ">
                              <Text className="text-orange-500 font-semibold ">Գին։</Text>
                              {item.product && (
                                <View className="ml-1 flex-row items-center">
                                  <Text
                                    className={`text-orange-500  ${
                                      item.product.discount ? 'line-through text-gray-600' : ''
                                    }`}>
                                    {item.product.price}
                                    &nbsp;․դր
                                  </Text>
                                  {item.product.discount ? (
                                    <Text className="text-sm text-orange-500 ml-1">
                                      {formattedPrice(
                                        calculateDiscountedPrice(
                                          item.product.price,
                                          item.product.discount
                                        )
                                      )}
                                      &nbsp;․դր
                                    </Text>
                                  ) : null}
                                </View>
                              )}
                            </View>
                            <View>
                              {item.product && (
                                <NumericInput
                                  onChange={(value) =>
                                    dispatch(updateItemCount({ itemId: item._id, newValue: value }))
                                  }
                                  totalWidth={100}
                                  type="plus-minus"
                                  valueType="real"
                                  rounded
                                  totalHeight={25}
                                  value={item.itemCount}
                                  minValue={0}
                                  maxValue={99}
                                />
                              )}
                            </View>
                          </View>
                        </View>
                      </View>
                    )}
                  </>
                )}
                horizontal={false}
                keyExtractor={(item: TOrderItem) => item._id}
              />
            </View>
            <View className="bg-white flex-row justify-between p-4 items-center w-full rounded-lg">
              <Text className="text-lg text-gray-400">Ընդհանուր</Text>
              <Text className="font-semibold">{formattedPrice(sumItemsPrice)} ․դր</Text>
            </View>
            <View className="w-full items-center">
              <View>
                <Text className="text-lg text-gray-400">Փաթեթավորման տեսակը</Text>
              </View>
              <View className="flex-row rounded-lg shadow bg-white mt-3">
                <TouchableOpacity
                  className={`items-center justify-center py-2 min-w-[160px]${
                    basket.packaging === EPackage.BAG ? ' bg-orange-400 rounded-lg' : ''
                  }`}
                  onPress={() => handleChangePackagingType(EPackage.BAG)}>
                  <Text
                    className={`text-base text-gray-500${
                      basket.packaging === EPackage.BAG ? ' text-black' : ''
                    }`}>
                    Տոպրակ
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`items-center justify-center py-2 min-w-[160px]${
                    basket.packaging === EPackage.BOX ? ' bg-orange-400 rounded-lg' : ''
                  }`}
                  onPress={() => handleChangePackagingType(EPackage.BOX)}>
                  <Text
                    className={`text-base text-gray-500${
                      basket.packaging === EPackage.BOX ? ' text-black' : ''
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
                    value={basket.necessaryNotes}
                    onChangeText={(text: string) => handleChangeNotes(text)}
                  />
                </View>
              </View>
              <View className="w-full mt-6">
                <TouchableOpacity
                  className="min-h-[40px] p-4 items-center justify-center rounded-lg bg-orange-400"
                  onPress={handleClick}
                  disabled={toOrder.isLoading}>
                  {toOrder.isLoading ? (
                    <ActivityIndicator size="small" />
                  ) : (
                    <Text className="text-white text-base font-semibold">Պատվիրել</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </Main>
  );
};
