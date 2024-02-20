import { AntDesign, Foundation, MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';

import { ItemsByCategory } from './ui';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { getOrderByUserInProgressThunk } from '../../../redux/http/orderThunk';
import { fetchDiscountedProductsThunk, fetchProductsThunk } from '../../../redux/http/productThunk';
import { TItemsWithTotalLength, TProduct } from '../../../redux/types';
import { ETypeError } from '../../../types';
import { ICON_MAIN_COLOR, LIMIT_NUMBER } from '../../../utils/constants';
import { categoryHome } from '../../../utils/product';
import { Loading, NetworkError } from '../../ui';
import { Main } from '../../wrappers';

export const Home = () => {
  const dispatch = useAppDispatch();
  // React Navigation hooks for setting options and navigating
  const { setOptions, navigate } = useNavigation<NavigationProp<ParamListBase>>();

  // Function to handle navigation to 'about-app' screen
  const handleNavigateToAbout = (): void => {
    navigate('about-app');
  };

  // Set custom header right button with icon for navigation
  React.useLayoutEffect((): void => {
    setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleNavigateToAbout}>
          <AntDesign name="exclamationcircle" size={24} color="gray" />
        </TouchableOpacity>
      ),
    });
  }, []);

  // Retrieve user information and various order-related states from the Redux store
  const { user } = useAppSelector((state) => state.user);
  const {
    deleteItem,
    changeStatus,
    toOrder,
    create: createOrder,
  } = useAppSelector((state) => state.order);
  // Retrieve product data from the Redux store
  const {
    products,
    discountedProducts,
    create: createProduct,
    createByDocument,
    update: updateProduct,
    delete: deleteProduct,
  } = useAppSelector((state) => state.product);

  const loadingStates: (boolean | null)[] = [
    createOrder.isLoading,
    deleteItem.isLoading,
    changeStatus.isLoading,
    toOrder.isLoading,
    createProduct.isLoading,
    createByDocument.isLoading,
    updateProduct.isLoading,
    deleteProduct.isLoading,
  ];

  // Determine overall loading status for multiple actions
  const isLoading: boolean | null = loadingStates.some(
    (loadingState: boolean | null) => loadingState
  );

  const fetchData = (): void => {
    dispatch(fetchProductsThunk({ limit: LIMIT_NUMBER }));
    dispatch(fetchDiscountedProductsThunk({ limit: LIMIT_NUMBER }));
  };

  const fetchDataInProgress = (): void => {
    dispatch(getOrderByUserInProgressThunk(user?._id as string));
  };

  React.useEffect((): void => {
    fetchData();
  }, [isLoading]);

  React.useEffect((): void => {
    fetchDataInProgress();
  }, [createOrder.isLoading]);

  const handleRefresh = (): void => {
    fetchData();
  };

  const isNetworkError: boolean = products.isNetworkError || discountedProducts.isNetworkError;
  const isTechnicalError: boolean = products.isError || discountedProducts.isError;

  const renderCategory = (
    products: TItemsWithTotalLength<TProduct[]>,
    categoryTitle: string,
    icon: React.ReactNode
  ) => <ItemsByCategory products={products} categoryTitle={categoryTitle} icon={icon} />;

  return products.isLoading || discountedProducts.isLoading ? (
    <Loading />
  ) : (
    <Main>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={products.isLoading as boolean} onRefresh={handleRefresh} />
        }>
        {isNetworkError || isTechnicalError ? (
          <NetworkError
            handleRefresh={handleRefresh}
            type={isTechnicalError ? ETypeError.TECHNICAL : ETypeError.NETWORK}
          />
        ) : (
          <View className="mx-4 mb-3">
            <FlatList
              scrollEnabled={false}
              data={[
                {
                  products,
                  categoryTitle: categoryHome.newProducts,
                  icon: <Foundation name="burst-new" size={34} color={ICON_MAIN_COLOR} />,
                },
                {
                  products: discountedProducts,
                  categoryTitle: categoryHome.discountProducts,
                  icon: (
                    <MaterialCommunityIcons
                      name="brightness-percent"
                      size={28}
                      color={ICON_MAIN_COLOR}
                    />
                  ),
                },
              ]}
              keyExtractor={(item) => item.categoryTitle}
              renderItem={({ item }) =>
                renderCategory(item.products, item.categoryTitle, item.icon)
              }
            />
          </View>
        )}
      </ScrollView>
    </Main>
  );
};
