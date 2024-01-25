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

  // React Navigation hooks
  const navigation = useNavigation<NavigationProp<any, any>>();
  const route = useRoute();
  const { categoryTitle }: TCategoryRouteParams = route.params as TCategoryRouteParams;

  // Redux state selectors for products on the home screen
  const { productsForHomeScreen, discountedProductsForHomeScreen } = useAppSelector(
    (state) => state.product
  );

  // State to track the current page for fetching products
  const [currentProductPage, setProductCurrentPage] = React.useState<number>(1);

  // Function to fetch data based on the selected category title
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

  // Fetch data on component mount or page change
  React.useEffect((): void => {
    fetchData();
  }, [currentProductPage]);

  // Update header title based on the selected category
  React.useLayoutEffect((): void => {
    navigation.setOptions({
      headerTitle: categoryTitle,
    });
  }, []);

  // Determine which set of products to display based on the selected category
  const products =
    categoryTitle === categoryHome.newProducts
      ? productsForHomeScreen
      : discountedProductsForHomeScreen;

  // Function to handle moving to the previous page of products
  const handlePrevProductPage = (): void => {
    if (currentProductPage > 1) {
      setProductCurrentPage((prevPage: number) => prevPage - 1);
    }
  };

  // Function to handle moving to the next page of products
  const handleNextProductPage = (): void => {
    if (currentProductPage * LIMIT_NUMBER < products.total_items) {
      setProductCurrentPage((prevPage: number) => prevPage + 1);
    }
  };

  // Determine button disable status based on current page and total items
  const previousButtonDisable: boolean = currentProductPage <= 1;
  const nextButtonDisable: boolean = currentProductPage * LIMIT_NUMBER >= products.total_items;

  // Function to handle manual data refresh
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
                isLastInRow={products.total_items % 2 === 0 || index === products.total_items - 1}
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
