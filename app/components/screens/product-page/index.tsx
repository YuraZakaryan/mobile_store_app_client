import { Feather } from '@expo/vector-icons';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ETypeInfo, TProductRouteParams } from './types';
import { InfoItem } from './wrapper';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { createOrAddOrderThunk } from '../../../redux/http/orderThunk';
import { fetchProductThunk } from '../../../redux/http/productThunk';
import { changeForm, setProductId } from '../../../redux/reducers/order/orderSlice';
import { TProduct, TRole } from '../../../redux/types';
import { TOrderItem } from '../../../redux/types/order';
import { SHOW_ERROR } from '../../../toasts';
import { API_URL, ICON_MAIN_COLOR } from '../../../utils/constants';
import { NumericInputCustom, SaleIcon } from '../../wrappers';

export const ProductPage = () => {
  const dispatch = useAppDispatch();
  const [orderExistsAfterClick, setOrderExistsAfterClick] = React.useState<boolean>(false);
  const { setOptions } = useNavigation<NavigationProp<any, any>>();
  const route = useRoute();
  const { title, productId }: TProductRouteParams = route.params as TProductRouteParams;
  const { newItemForm, create, basket, deleteItem } = useAppSelector((state) => state.order);
  const { user } = useAppSelector((state) => state.user);
  const { currentProduct } = useAppSelector((state) => state.product);

  // Set header title
  React.useLayoutEffect((): void => {
    setOptions({
      headerTitle: title,
    });
  }, []);

  const fetchData = (): void => {
    dispatch(fetchProductThunk(productId));
  };

  React.useEffect(() => {
    fetchData();
  }, [productId, deleteItem.isLoading, create.isLoading]);

  // Dispatch product id on item change
  React.useEffect((): void => {
    dispatch(setProductId({ product: productId, author: user?._id as string, itemCount: 0 }));
  }, [productId]);

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

  // Check if the order exists in the basket
  const orderExists: boolean = basket.items.some(
    (order: TOrderItem): boolean => order.product._id === productId
  );

  // Check if the button should be disabled
  const isButtonDisable: boolean =
    newItemForm.itemCount === 0 || create.isLoading || orderExists || orderExistsAfterClick;

  const product = currentProduct.product as TProduct;
  // Check if the item has a discount
  const checkDiscount: boolean = product && product.discount > 0;

  // Handle button click
  const handleClick = (): void => {
    dispatch(createOrAddOrderThunk(newItemForm))
      .unwrap()
      .then((res: TProduct) => res && setOrderExistsAfterClick(true))
      .catch((err): void => {
        if (err === 409) {
          SHOW_ERROR('Ձեր էջը հաստատված չէ, փորձել մի փոքր ուշ');
        } else if (err === 410) {
          SHOW_ERROR('Ձեր հաշիվը արգելափակված է');
        } else if (err === 502) {
          SHOW_ERROR('ՈՉ ԲԱՎԱՐԱՐ ԱՊՐԱՆՔԻ ՔԱՆԱԿ, ԹԱՐՄԱՑՐԵՔ ԷՋԸ');
        } else if (err === 401) {
          SHOW_ERROR('Կխնդրեինք առաջին հերթին մուտք գործել');
        } else {
          SHOW_ERROR('Ապրանքի զամբյուղում ավելացնելու հետ կապված խնդրի է առաջացել');
        }
      });
  };

  const handleRefresh = (): void => {
    fetchData();
  };

  const value = newItemForm.itemCount;
  const role = user?.role as TRole;

  return (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={currentProduct.isLoading ?? false}
            onRefresh={handleRefresh}
          />
        }>
        <View className="p-4 gap">
          {product && (
            <>
              <View className="overflow-hidden w-full items-center relative">
                <Image
                  source={
                    product.picture
                      ? {
                          uri: (product.picture && `${API_URL}/${product.picture}`) ?? false,
                        }
                      : require('./../../../assets/images/no_image.jpg')
                  }
                  className="w-60 h-60 rounded-lg"
                  alt="picture"
                />
                {checkDiscount ? <SaleIcon discount={product.discount} /> : null}
              </View>
              <View className="w-full mt-4">
                <View className="bg-white flex-row items-center justify-between border border-gray-200 mb-1 rounded-lg">
                  <Text className="text-gray-500 p-4">Քանակը</Text>
                  <View className="px-4">
                    <NumericInputCustom
                      value={value}
                      minValue={0}
                      maxValue={product.count}
                      onChange={(value: number) => handleChange('itemCount', value)}
                    />
                  </View>
                </View>
                <InfoItem type={ETypeInfo.LONG} label="Անվանում" content={product.title} />
                <InfoItem label="Ընդհանուր քանակը" content={product.count} />
                <InfoItem label="Կոդ" content={product.code} />
                {role === 'USER' ? (
                  <InfoItem
                    label="Գին"
                    content={product.priceWholesale}
                    type={checkDiscount ? ETypeInfo.PRICE_WITH_DISCOUNTED : ETypeInfo.PRICE}
                    discount={product.discount}
                  />
                ) : role === 'SUPERUSER' ? (
                  <>
                    <InfoItem
                      label="Գին մանրածախ"
                      content={product.priceRetail}
                      type={checkDiscount ? ETypeInfo.PRICE_WITH_DISCOUNTED : ETypeInfo.PRICE}
                      discount={product.discount}
                    />
                    <InfoItem
                      label="Գին մեծածախ"
                      content={product.priceWholesale}
                      type={checkDiscount ? ETypeInfo.PRICE_WITH_DISCOUNTED : ETypeInfo.PRICE}
                      discount={product.discount}
                    />
                  </>
                ) : (
                  <>
                    <InfoItem
                      label="Գին մանրածախ"
                      content={product.priceRetail}
                      type={checkDiscount ? ETypeInfo.PRICE_WITH_DISCOUNTED : ETypeInfo.PRICE}
                      discount={product.discount}
                    />
                    <InfoItem
                      label="Գին մեծածախ"
                      content={product.priceWholesale}
                      type={checkDiscount ? ETypeInfo.PRICE_WITH_DISCOUNTED : ETypeInfo.PRICE}
                      discount={product.discount}
                    />
                    <InfoItem
                      label="Գին Wildberries"
                      content={product.priceWildberries}
                      type={checkDiscount ? ETypeInfo.PRICE_WITH_DISCOUNTED : ETypeInfo.PRICE}
                      discount={product.discount}
                    />
                  </>
                )}

                {checkDiscount ? <InfoItem label="Զեղչ" content={product.discount + ' %'} /> : null}
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
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
