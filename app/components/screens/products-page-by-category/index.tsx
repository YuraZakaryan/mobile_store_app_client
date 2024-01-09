import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { FlatList, RefreshControl, SafeAreaView, ScrollView, View } from 'react-native';

import { TCategoryRouteParams } from './types';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  fetchDiscountedProductsForHomeCategoryThunk,
  fetchProductsForHomeCategoryThunk,
} from '../../../redux/http/productThunk';
import { TProduct } from '../../../redux/types';
import { LIMIT_NUMBER } from '../../../utils/constants';
import { categoryHome } from '../../../utils/product';
import { Loading } from '../../ui';
import { PaginationButtons, ProductItem } from '../../wrappers';

export const ProductsPageByCategory = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<any, any>>();
  const route = useRoute();
  const { categoryTitle }: TCategoryRouteParams = route.params as TCategoryRouteParams;
  const { productsForHomeScreen, discountedProductsForHomeScreen } = useAppSelector(
    (state) => state.product
  );
  const [currentProductPage, setProductCurrentPage] = React.useState<number>(1);

  const fetchData = (): void => {
    if (categoryTitle === categoryHome.newProducts) {
      dispatch(
        fetchProductsForHomeCategoryThunk({ page: currentProductPage, limit: LIMIT_NUMBER })
      );
    } else if (categoryTitle === categoryHome.discountProducts) {
      dispatch(
        fetchDiscountedProductsForHomeCategoryThunk({
          page: currentProductPage,
          limit: LIMIT_NUMBER,
        })
      );
    }
  };

  React.useEffect((): void => {
    fetchData();
  }, [currentProductPage]);

  React.useLayoutEffect((): void => {
    navigation.setOptions({
      headerTitle: categoryTitle,
    });
  }, []);

  const products =
    categoryTitle === categoryHome.newProducts
      ? productsForHomeScreen
      : discountedProductsForHomeScreen;

  const handlePrevProductPage = (): void => {
    if (currentProductPage > 1) {
      setProductCurrentPage((prevPage: number) => prevPage - 1);
    }
  };

  const handleNextProductPage = (): void => {
    if (currentProductPage * LIMIT_NUMBER < products.total_items) {
      setProductCurrentPage((prevPage: number) => prevPage + 1);
    }
  };
  const previousButtonDisable: boolean = currentProductPage <= 1;
  const nextButtonDisable: boolean = currentProductPage * LIMIT_NUMBER >= products.total_items;

  const handleRefresh = () => {
    fetchData();
  };

  return products.isLoading ? (
    <Loading />
  ) : (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={products.isLoading} onRefresh={handleRefresh} />
        }>
        <View className="m-4">
          <FlatList
            scrollEnabled={false}
            data={products.items}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            renderItem={({ index, item }) => (
              <ProductItem
                item={item}
                index={index}
                isLastInRow={products.total_items % 2 === 1 || index === products.total_items - 1}
                key={item._id}
              />
            )}
            numColumns={2}
            horizontal={false}
            keyExtractor={(item: TProduct) => item._id}
          />
          <PaginationButtons
            total_items={products.total_items}
            previousButtonDisable={previousButtonDisable}
            nextButtonDisable={nextButtonDisable}
            handlePrevPage={handlePrevProductPage}
            handleNextPage={handleNextProductPage}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
