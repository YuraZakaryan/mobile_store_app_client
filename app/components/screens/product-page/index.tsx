import { FontAwesome } from '@expo/vector-icons';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import {
  Image,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import ImageViewer from 'react-native-image-zoom-viewer';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { fetchProductThunk } from '../../../redux/http/productThunk';
import { changeForm, setProductId } from '../../../redux/reducers/order/orderSlice';
import { TProduct, TRole } from '../../../redux/types';
import { API_URL } from '../../../utils/constants';
import { NumericInputCustom, SaleIcon } from '../../wrappers';
import { ETypeInfo, TProductRouteParams } from './types';
import { AddToCart } from './ui';
import { InfoItem } from './wrapper';

export const ProductPage = () => {
  const dispatch = useAppDispatch();
  const [orderExistsAfterClick, setOrderExistsAfterClick] = React.useState<boolean>(false);
  const [isModalVisible, setModalVisible] = React.useState(false);

  const { setOptions } = useNavigation<NavigationProp<any, any>>();
  const route = useRoute();
  const { title, productId }: TProductRouteParams = route.params as TProductRouteParams;
  const { newItemForm, create, deleteItem } = useAppSelector((state) => state.order);
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

  const product = currentProduct.product as TProduct;
  // Check if the item has a discount
  const checkDiscount: boolean = product && product.discount > 0;

  const handleRefresh = (): void => {
    fetchData();
  };

  const value = newItemForm.itemCount;
  const role = user?.role as TRole;

  const images = product?.picture ? [{ url: `${API_URL}/${product.picture}` }] : [];

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

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
                <TouchableOpacity onPress={toggleModal}>
                  <Image
                    source={
                      product.picture
                        ? { uri: `${API_URL}/${product.picture}` }
                        : require('./../../../assets/images/no_image.jpg')
                    }
                    className="w-60 h-60 rounded-lg"
                    alt="picture"
                  />
                </TouchableOpacity>
                {checkDiscount ? <SaleIcon discount={product.discount} /> : null}
                <Modal visible={isModalVisible} transparent>
                  <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <TouchableOpacity
                      onPress={toggleModal}
                      style={{ position: 'absolute', top: 40, right: 20, zIndex: 1 }}>
                      <FontAwesome name="window-close" size={25} color="white" />
                    </TouchableOpacity>
                    <ImageViewer
                      imageUrls={images}
                      enableSwipeDown
                      onSwipeDown={toggleModal}
                      backgroundColor="transparent"
                      enableImageZoom
                      minScale={0.9}
                      renderIndicator={() => (
                        <View
                          style={{
                            display: 'none',
                          }}
                        />
                      )}
                    />
                  </View>
                </Modal>
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
              <AddToCart productId={productId} />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
