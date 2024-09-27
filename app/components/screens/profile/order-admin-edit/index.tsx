import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useLayoutEffect, useState } from 'react';
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
import DropDownPicker from 'react-native-dropdown-picker';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { useIsTablet } from '../../../../hooks/useIsTablet';
import { getOneAdminOrderThunk } from '../../../../redux/http/orderThunk';
import {
  setAdminOrderNecessaryNotes,
  updateItemCount,
} from '../../../../redux/reducers/order/orderSlice';
import { TCounterParty } from '../../../../redux/types';
import { TOrderItem } from '../../../../redux/types/order';
import { API_URL } from '../../../../utils/constants';
import { calculateDiscountedPrice, formattedPrice } from '../../../../utils/product';
import { Loading } from '../../../ui';
import { Main, NumericInputCustom } from '../../../wrappers';
import { CrudMainButton } from '../../../wrappers/crud-main-button';
import { TOrderViewRouteParams } from '../order-view/types';

export const OrderAdminEdit = () => {
  const dispatch = useAppDispatch();

  const { navigate, setOptions } =
    useNavigation<NavigationProp<Record<string, object | undefined>>>();

  const { isTablet } = useIsTablet();

  const { adminOrder: order, create, deleteItem } = useAppSelector((state) => state.order);

  const [itemLoadingStates, setItemLoadingStates] = useState<{ [itemId: string]: boolean }>({});
  const [open, setOpen] = useState<boolean>(false);
  const [counterParty, setCounterParty] = useState('');
  const route = useRoute();

  const { item }: TOrderViewRouteParams = route.params as TOrderViewRouteParams;

  // Set header title
  useLayoutEffect((): void => {
    setOptions({
      headerTitle: item?._id ? 'Փոփոխել պարվերը' : 'Ստեղծել պատվեր',
    });
  }, [item]);

  const orderId = item ? (item?._id as string) : '';
  const isLoading = order.requestStatus.isLoading || isTablet === null;
  const items = order.items;
  const totalCurrentPage: number = items.length;
  const isAnyItemCountZero = items.some((item) => item.itemCount === 0);

  const fetchData = (): void => {
    if (item) {
      dispatch(getOneAdminOrderThunk(orderId));
    }
  };

  useEffect(() => {
    fetchData();
  }, [orderId, deleteItem.isLoading, create.isLoading]);

  useEffect(() => {
    setCounterParty(order.counterpartyId);
  }, [order.counterpartyId]);

  // Handle deletion of an order item
  const handleDelete = (_id: string): void => {
    setItemLoadingStates((prevLoadingStates) => ({
      ...prevLoadingStates,
      [_id]: true,
    }));

    // dispatch(deleteOrderItemThunk(_id))
    //   .then((): void => {
    //     setItemLoadingStates((prevLoadingStates) => ({
    //       ...prevLoadingStates,
    //       [_id]: false,
    //     }));
    //   })
    //   .catch((err): void => {
    //     err && SHOW_ERROR('Ապրանքի ջնջման հետ կապված խնդիր է առաջացել');
    //   });
  };

  const sumItemsPrice: number = items.reduce((acc: number, item: TOrderItem): number => {
    if (item.product && item.product.priceWholesale) {
      const itemPrice: number = item.product.discount
        ? calculateDiscountedPrice(item.product.priceWholesale, item.product.discount)
        : item.product.priceWholesale;
      return acc + itemPrice * item.itemCount;
    }
    return acc;
  }, 0);

  const users: TCounterParty[] = [
    {
      id: '1',
      name: 'Vzgo',
      code: 'wadwa',
      phone: '044209460',
      externalCode: 'dwada',
      legalTitle: 'Vzgo',
    },
    {
      id: '2',
      name: 'Tatevik',
      code: 'wada',
      phone: '041209460',
      externalCode: 'daw',
      legalTitle: 'Tatevik',
    },
  ];

  const counterParties = users.map((user: TCounterParty) => ({
    key: user.id,
    label: user.name,
    value: user.id,
  }));

  const handleSelectChange = (value: string): void => {
    setCounterParty(value);
  };

  const handleChangeNotes = (text: string): void => {
    dispatch(setAdminOrderNecessaryNotes(text));
  };

  const handleNavigate = (): void => {
    navigate('search group', {});
  };

  const handleClick = () => {
    console.log('CLICK');
  };

  const renderItem = ({ index, item }: { index: number; item: TOrderItem }) => {
    return (
      <>
        {item.product && (
          <View
            className={`flex-row flex-1 min-h-[150px] bg-white shadow relative ${totalCurrentPage % 2 === 1 && index === totalCurrentPage - 1 ? 'rounded-t-lg' : 'rounded-lg'}`}>
            <TouchableOpacity
              className="absolute right-3 top-3"
              disabled={itemLoadingStates[item._id]}
              onPress={() => handleDelete(item._id)}>
              {itemLoadingStates[item._id] ? (
                <ActivityIndicator
                  style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
                  size="large"
                  color="orange"
                />
              ) : (
                <Image
                  source={require('../../../../assets/icons/delete-icon.png')}
                  className="w-6 h-6"
                  tintColor="orange"
                />
              )}
            </TouchableOpacity>
            <View>
              {item.product && (
                <Image
                  source={
                    item.product.picture
                      ? {
                          uri:
                            (item.product.picture && `${API_URL}/${item.product.picture}`) ?? false,
                        }
                      : require('./../../../../assets/images/no_image.jpg')
                  }
                  className={`w-40 h-40 rounded-lg my-2 ${isTablet ? 'w-40 h-40' : 'w-24 h-24'}`}
                  alt={item.product.title}
                />
              )}
            </View>
            <View className="m-3 justify-between">
              <View className="max-w-[85%]">
                {item.product && <Text className="text-blue-600">{item.product.title}</Text>}
              </View>
              <View className="gap-1">
                {item.product && <Text className="text-gray-600">Կոդ։ {item.product.code}</Text>}
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
                        {item.product.priceWholesale}
                        &nbsp;․դր
                      </Text>
                      {item.product.discount ? (
                        <Text className="text-sm text-orange-500 ml-1">
                          {formattedPrice(
                            calculateDiscountedPrice(
                              item.product.priceWholesale,
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
  };

  // Refresh data
  const handleRefresh = (): void => {
    fetchData();
  };

  return isLoading ? (
    <Loading />
  ) : (
    <Main>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading ?? false} onRefresh={handleRefresh} />
        }>
        <View className="w-full p-4 space-y-6">
          <View className="w-full">
            <FlatList
              data={items}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              horizontal={false}
              renderItem={renderItem}
            />
            <View className="flex-row mt-2 flex-1 min-h-[40px] items-center px-4 bg-white border-gray-200 rounded-b-lg">
              <TouchableOpacity onPress={handleNavigate}>
                <Text className="text-orange-400 font-bold">+ Ավելացնել</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="bg-white flex-row justify-between p-4 items-center w-full rounded-lg">
            <Text className="text-lg text-gray-400">Ընդհանուր</Text>
            <Text className="font-semibold">{formattedPrice(sumItemsPrice)} ․դր</Text>
          </View>
          <View className="space-y-1">
            <Text>Ընտրել հաճախորդին</Text>
            <DropDownPicker
              open={open}
              value={counterParty}
              items={counterParties}
              setOpen={setOpen}
              placeholder="Ընտրել"
              style={{
                width: '100%',
                borderRadius: 4,
                borderColor: '#D3D3D3',
                paddingLeft: 12,
                paddingRight: 12,
                backgroundColor: 'transparent',
              }}
              placeholderStyle={{
                color: '#8a8686',
                fontWeight: 'bold',
              }}
              setValue={(val) => handleSelectChange(val(val))}
              listMode="SCROLLVIEW"
              scrollViewProps={{
                nestedScrollEnabled: true,
              }}
            />
          </View>
          <View className="flex-1 w-full items-center mt-3">
            <Text className="text-lg text-gray-400">Անհրաժեշտ նշումներ</Text>
            <View className="w-full rounded-lg overflow-hidden mt-3">
              <TextInput
                className={`bg-white mx-auto w-full px-2 py-3 text-base ${isTablet ? 'w-11/12 rounded-md' : 'w-full'}`}
                value={order.necessaryNotes}
                onChangeText={(text: string) => handleChangeNotes(text)}
              />
            </View>
          </View>
          <View className="w-full mt-6">
            <CrudMainButton
              handleSubmit={handleClick}
              disabled={false}
              isLoading={false}
              className="py-4 bg-gray-500">
              Պահպանել
            </CrudMainButton>
            <CrudMainButton
              handleSubmit={handleClick}
              disabled={false}
              isLoading={false}
              className="py-4 mt-2">
              Ստեղծել Պատվեր
            </CrudMainButton>
          </View>
        </View>
      </ScrollView>
    </Main>
  );
};
