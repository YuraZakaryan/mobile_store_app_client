import { Foundation, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ItemsByCategory } from './ui';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { getOrderByUserInProgressThunk } from '../../../redux/http/orderThunk';
import { fetchDiscountedProductsThunk, fetchProductsThunk } from '../../../redux/http/productThunk';
import { ICON_MAIN_COLOR, LIMIT_NUMBER } from '../../../utils/constants';
import { categoryHome } from '../../../utils/product';

export const Home = () => {
  const dispatch = useAppDispatch();
  const { setOptions, navigate } = useNavigation<NavigationProp<ParamListBase>>();
  const handleNavigate = (): void => {
    navigate('about-app');
  };
  React.useLayoutEffect((): void => {
    setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleNavigate}>
          <AntDesign name="exclamationcircle" size={24} color={ICON_MAIN_COLOR} />
        </TouchableOpacity>
      ),
    });
  }, []);

  const { user } = useAppSelector((state) => state.user);
  const { deleteItem, create, changeStatus, toOrder } = useAppSelector((state) => state.order);
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

  const { products, discountedProducts } = useAppSelector((state) => state.product);

  const handleRefresh = (): void => {
    fetchData();
  };

  return (
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
