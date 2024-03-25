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
import { EPackage, TOrder, TOrderItem } from '../../../redux/types/order';
import { SHOW_ERROR, SHOW_SUCCESS } from '../../../toasts';
import { API_URL } from '../../../utils/constants';
import { calculateDiscountedPrice, formattedPrice } from '../../../utils/product';
import { EmptyOrder } from '../../ui';
import { Main, NumericInputCustom } from '../../wrappers';

export const Basket = () => {
  const dispatch = useAppDispatch();
  const [itemLoadingStates, setItemLoadingStates] = React.useState<{ [itemId: string]: boolean }>(
    {}
  );
  const { basket, fetchBasketOrder, toOrder, create } = useAppSelector((state) => state.order);
  const { user } = useAppSelector((state) => state.user);
  const isAnyItemCountZero = basket.items.some((item) => item.itemCount === 0);
  const isLoading: boolean = create.isLoading as boolean;

  const fetchData = (): void => {
    dispatch(getOrderByUserInProgressThunk(user?._id as string));
  };

  // Fetch data when loading state changes
  React.useEffect((): void => {
    fetchData();
  }, [isLoading]);

  // Calculate the total price of items in the basket
  const sumItemsPrice: number = basket.items.reduce((acc: number, item: TOrderItem): number => {
    if (item.product && item.product.price) {
      const itemPrice: number = item.product.discount
        ? calculateDiscountedPrice(item.product.price, item.product.discount)
        : item.product.price;
      return acc + itemPrice * item.itemCount;
    }
    return acc;
  }, 0);

  // Handle change in packaging type
  const handleChangePackagingType = (typePackaging: EPackage): void => {
    dispatch(setPackaging(typePackaging));
  };

  // Handle change in notes
  const handleChangeNotes = (text: string): void => {
    dispatch(setNecessaryNotes(text));
  };

  // Handle deletion of an order item
  const handleDelete = (_id: string): void => {
    setItemLoadingStates((prevLoadingStates) => ({
      ...prevLoadingStates,
      [_id]: true,
    }));

    dispatch(deleteOrderItemThunk(_id))
      .then((): void => {
        setItemLoadingStates((prevLoadingStates) => ({
          ...prevLoadingStates,
          [_id]: false,
        }));
      })
      .catch((err): void => {
        err && SHOW_ERROR('Ապրանքի ջնջման հետ կապված խնդիր է առաջացել');
      });
  };

  // Move items to the order
  const handleClick = (): void => {
    dispatch(toOrderThunk(basket))
      .unwrap()
      .then((res: TOrder) => res && SHOW_SUCCESS('Պատվերը հաջողությամբ հաստատվեց'))
      .catch((err): void => {
        if (err === 502) {
          SHOW_ERROR('ՈՉ ԲԱՎԱՐԱՐ ԱՊՐԱՆՔԻ ՔԱՆԱԿ, ԹԱՐՄԱՑՐԵՔ ԷՋԸ');
        } else {
          SHOW_ERROR('Պատվերի հաստատման հետ կապված խնդիր է առաջացել');
        }
      });
  };

  // Refresh data
  const handleRefresh = (): void => {
    fetchData();
  };

  return (
    <Main>
      {fetchBasketOrder.isLoading !== null &&
      (!basket.items.length || basket.items.length === 0) ? (
        <EmptyOrder text="Զամբյուղը դատարկ է" />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={fetchBasketOrder.isLoading ?? false}
              onRefresh={handleRefresh}
            />
          }>
          <View className="w-full p-4 gap-6">
            <View className="w-full">
              <FlatList
                data={basket.items}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                renderItem={({ item }) => {
                  return (
                    <>
                      {item.product && (
                        <View className="flex-row flex-1 min-h-[150px] bg-white shadow rounded-lg relative">
                          <TouchableOpacity
                            className="absolute right-2 top-2"
                            disabled={itemLoadingStates[item._id]}
                            onPress={() => handleDelete(item._id)}>
                            {itemLoadingStates[item._id] ? (
                              <ActivityIndicator size="small" color="red" />
                            ) : (
                              <FontAwesome name="window-close" size={23} color="red" />
                            )}
                          </TouchableOpacity>
                          <View>
                            {item.product && (
                              <Image
                                source={
                                  item.product.picture
                                    ? {
                                        uri:
                                          (item.product.picture &&
                                            `${API_URL}/${item.product.picture}`) ??
                                          false,
                                      }
                                    : require('./../../../assets/images/no_image.jpg')
                                }
                                className="w-24 h-24 rounded-lg my-2"
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
                              {item.product && (
                                <Text className="text-gray-600 font-semibold">
                                  Հասանելի քանակը։ {item.product.count}
                                </Text>
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
                                  <NumericInputCustom
                                    value={item.itemCount}
                                    minValue={0}
                                    maxValue={item.product.count}
                                    onChange={(newValue: number): void => {
                                      dispatch(updateItemCount({ itemId: item._id, newValue }));
                                    }}
                                  />
                                )}
                              </View>
                            </View>
                          </View>
                        </View>
                      )}
                    </>
                  );
                }}
                horizontal={false}
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
                  className={`min-h-[40px] p-4 items-center justify-center rounded-lg bg-orange-400 ${
                    isAnyItemCountZero ? 'bg-gray-400' : ''
                  }`}
                  onPress={handleClick}
                  disabled={toOrder.isLoading || isAnyItemCountZero}>
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
