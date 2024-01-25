import { Feather } from '@expo/vector-icons';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import NumericInput from 'react-native-numeric-input';

import { ETypeInfo, TProductRouteParams } from './types';
import { InfoItem } from './wrapper';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { createOrAddOrderThunk } from '../../../redux/http/orderThunk';
import { changeForm, setProductId } from '../../../redux/reducers/order/orderSlice';
import { TOrderItem } from '../../../redux/types/order';
import { API_URL, ICON_MAIN_COLOR } from '../../../utils/constants';
import { SaleIcon } from '../../wrappers';

export const ProductPage = () => {
  const dispatch = useAppDispatch();
  const [orderExistsAfterClick, setOrderExistsAfterClick] = React.useState<boolean>(false);
  const { setOptions, setParams } = useNavigation<NavigationProp<any, any>>();
  const route = useRoute();
  const { item }: TProductRouteParams = route.params as TProductRouteParams;
  const { newItemForm, create, basket, deleteItem } = useAppSelector((state) => state.order);
  const { user } = useAppSelector((state) => state.user);

  // Set header title
  React.useLayoutEffect((): void => {
    setOptions({
      headerTitle: item.title,
    });
  }, []);

  // Dispatch product id on item change
  React.useEffect((): void => {
    dispatch(setProductId({ product: item._id, author: user?._id as string, itemCount: 0 }));
  }, [item._id]);

  // Reset orderExistsAfterClick on deleteItem.isLoading change
  React.useEffect(() => {
    if (orderExistsAfterClick) {
      setOrderExistsAfterClick(false);
    }
  }, [deleteItem.isLoading]);

  // Handle form field change
  const handleChange = (name: string, value: string | number | null): void => {
    dispatch(changeForm({ name, value }));
  };

  // Handle button click
  const handleClick = (): void => {
    dispatch(createOrAddOrderThunk(newItemForm))
      .unwrap()
      .then((res): void => {
        setParams({ item: res });
        setOrderExistsAfterClick(true);
      })
      .catch((err) => console.log(err));
  };

  // Check if the order exists in the basket
  const orderExists: boolean = basket.items.some(
    (order: TOrderItem): boolean => order.product._id === item._id
  );

  // Check if the button should be disabled
  const isButtonDisable: boolean =
    newItemForm.itemCount === 0 || create.isLoading || orderExists || orderExistsAfterClick;

  // Check if the item has a discount
  const checkDiscount: boolean = item.discount > 0;

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="p-4 gap">
          <View className="overflow-hidden w-full items-center relative">
            <Image
              source={{ uri: `${API_URL}/${item.picture}` ?? '' }}
              className="w-60 h-60 rounded-lg"
              alt="picture"
            />
            {checkDiscount ? <SaleIcon discount={item.discount} /> : null}
          </View>
          <View className="w-full mt-4">
            <View className="bg-white flex-row items-center justify-between border border-gray-200 mb-1 rounded-lg">
              <Text className="text-gray-500 p-4">Քանակը</Text>
              <View className="px-4">
                <NumericInput
                  onChange={(value: number) => handleChange('itemCount', value)}
                  totalWidth={120}
                  type="plus-minus"
                  valueType="real"
                  rounded
                  totalHeight={35}
                  minValue={0}
                  maxValue={item.count}
                />
              </View>
            </View>
            <InfoItem label="Անվանում" content={item.title} />
            <InfoItem label="Ընդհանուր քանակը" content={item.count} />
            <InfoItem label="Կոդ" content={item.code} />
            <InfoItem
              label="Գին"
              content={item.price}
              type={checkDiscount ? ETypeInfo.PRICE_WITH_DISCOUNTED : ETypeInfo.PRICE}
              discount={item.discount}
            />
            {checkDiscount ? <InfoItem label="Զեղչ" content={item.discount + ' %'} /> : null}
          </View>
          <View className="min-h-[40px] w-full flex-1 justify-center mt-5 items-center">
            <TouchableOpacity
              className={`bg-orange-600 p-4 w-5/6 rounded-lg${
                isButtonDisable ? ' bg-gray-400' : ''
              }`}
              onPress={handleClick}
              disabled={isButtonDisable}>
              {create.isLoading ? (
                <ActivityIndicator size="small" />
              ) : orderExists || orderExistsAfterClick ? (
                <View className="flex-row items-center justify-center">
                  <Feather name="shopping-cart" size={16} color={ICON_MAIN_COLOR} />
                  <Text className="ml-2 text-white font-semibold">ԶԱՄԲՅՈՒՂՈՒՄ</Text>
                </View>
              ) : (
                <Text className="text-center text-white font-bold text-base">
                  Ավելացնել զամբյուղում
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
