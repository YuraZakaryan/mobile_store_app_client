import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { FlatList, RefreshControl, SafeAreaView, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  fetchDiscountedProductsForHomeCategoryThunk,
  fetchProductsForHomeCategoryThunk,
} from '../../../redux/http/productThunk';
import { TProduct } from '../../../redux/types';
import { LIMIT_NUMBER } from '../../../utils/constants';
import { categoryHome } from '../../../utils/product';
import { Loading, ScrollLoader } from '../../ui';
import { ProductItem } from '../../wrappers';
import { TCategoryRouteParams } from './types';

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

  // State to track if more data is being loaded
  const [isLoadingMore, setIsLoadingMore] = React.useState<boolean>(false);

  // Function to fetch data based on the selected category title
  const fetchData = (isRefreshing: boolean = false): void => {
    if (isRefreshing) {
      setProductCurrentPage(1);
    }

    if (categoryTitle === categoryHome.newProducts) {
      dispatch(
        fetchProductsForHomeCategoryThunk({ page: currentProductPage, limit: LIMIT_NUMBER })
      ).then(() => {
        setIsLoadingMore(false);
      });
    } else if (categoryTitle === categoryHome.discountProducts) {
      dispatch(
        fetchDiscountedProductsForHomeCategoryThunk({
          page: currentProductPage,
          limit: LIMIT_NUMBER,
        })
      ).then(() => {
        setIsLoadingMore(false);
      });
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

  // Function to handle loading more products when reaching the end of the list
  const handleLoadMore = () => {
    if (currentProductPage * LIMIT_NUMBER < products.total_items && !isLoadingMore) {
      setIsLoadingMore(true);
      setProductCurrentPage((prevPage: number) => prevPage + 1);
    }
  };
  // Function to handle manual data refresh
  const handleRefresh = () => {
    fetchData(true);
  };

  return products.isLoading && currentProductPage === 1 ? (
    <Loading />
  ) : (
    <SafeAreaView>
      <FlatList
        data={products.items}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        renderItem={({ index, item }) => (
          <ProductItem
            item={item}
            index={index}
            isLastInRow={products.items.length % 2 === 1 && index === products.items.length - 1}
            key={item._id}
          />
        )}
        numColumns={2}
        keyExtractor={(item: TProduct) => item._id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={products.isLoading as boolean} onRefresh={handleRefresh} />
        }
        ListFooterComponent={isLoadingMore ? <ScrollLoader /> : null}
      />
    </SafeAreaView>
  );
};
