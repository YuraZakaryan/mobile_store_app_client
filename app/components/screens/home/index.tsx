import { Foundation, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import React from 'react';
import { RefreshControl, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';

import { ItemsByCategory } from './ui';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { getOrderByUserInProgressThunk } from '../../../redux/http/orderThunk';
import { fetchDiscountedProductsThunk, fetchProductsThunk } from '../../../redux/http/productThunk';
import { ICON_MAIN_COLOR, LIMIT_NUMBER } from '../../../utils/constants';
import { categoryHome } from '../../../utils/product';
import { Loading } from '../../ui';

export const Home = () => {
  const dispatch = useAppDispatch();
  // React Navigation hooks for setting options and navigating
  const { setOptions, navigate } = useNavigation<NavigationProp<ParamListBase>>();

  // Function to handle navigation to 'about-app' screen
  const handleNavigate = (): void => {
    navigate('about-app');
  };

  // Set custom header right button with icon for navigation
  React.useLayoutEffect((): void => {
    setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleNavigate}>
          <AntDesign name="exclamationcircle" size={24} color="gray" />
        </TouchableOpacity>
      ),
    });
  }, []);

  // Retrieve user information and various order-related states from the Redux store
  const { user } = useAppSelector((state) => state.user);
  const { deleteItem, create, changeStatus, toOrder } = useAppSelector((state) => state.order);

  // Determine overall loading status for multiple actions
  const isLoading: boolean =
    create.isLoading || deleteItem.isLoading || changeStatus.isLoading || toOrder.isLoading;

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
  }, [create.isLoading]);

  // Retrieve product data from the Redux store
  const { products, discountedProducts } = useAppSelector((state) => state.product);

  const handleRefresh = (): void => {
    fetchData();
  };

  return products.isLoading || discountedProducts.isLoading ? (
    <Loading />
  ) : (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={products.isLoading} onRefresh={handleRefresh} />
        }>
        <View className="mx-4 mb-3">
          <ItemsByCategory
            products={products.items}
            categoryTitle={categoryHome.newProducts}
            icon={<Foundation name="burst-new" size={34} color={ICON_MAIN_COLOR} />}
          />
          <ItemsByCategory
            products={discountedProducts.items}
            categoryTitle={categoryHome.discountProducts}
            icon={
              <MaterialCommunityIcons name="brightness-percent" size={28} color={ICON_MAIN_COLOR} />
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
