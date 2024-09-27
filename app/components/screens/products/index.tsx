import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, RefreshControl, SafeAreaView, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { useIsTablet } from '../../../hooks/useIsTablet';
import { fetchCategoriesThunk } from '../../../redux/http/categoryThunk';
import { fetchProductsByCategoryThunk } from '../../../redux/http/productThunk';
import { ETypeError } from '../../../types';
import { getLimitNumber } from '../../../utils/constants';
import { Loading, NetworkError, ScrollLoader } from '../../ui';
import { ProductItem } from '../../wrappers';
import { ProductCategoryItem } from './wrapper';

export const Products = () => {
  const { isTablet, executeAfterDeviceCheck } = useIsTablet();
  const LIMIT_NUMBER = getLimitNumber(isTablet);

  // Redux state selectors
  const { chosen } = useAppSelector((state) => state.category);
  const {
    categories,
    create: createCategory,
    update: updateCategory,
    delete: deleteCategory,
  } = useAppSelector((state) => state.category);
  const {
    deleteItem,
    create: createOrder,
    changeStatus,
    toOrder,
  } = useAppSelector((state) => state.order);
  const {
    productsByCategory,
    create: createProduct,
    createByDocument,
    update: updateProduct,
    delete: deleteProduct,
  } = useAppSelector((state) => state.product);

  // State to track the current page for fetching products by category
  const [currentProductPage, setProductCurrentPage] = React.useState<number>(1);

  const [isLoadingMore, setIsLoadingMore] = React.useState<boolean>(false);

  // Loading status based on multiple order-related actions
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

  const isLoading: boolean | null = loadingStates.some(
    (loadingState: boolean | null) => loadingState
  );

  const loadingStatesCategory: (boolean | null)[] = [
    createCategory.isLoading,
    updateCategory.isLoading,
    deleteCategory.isLoading,
  ];
  const isLoadingCategory: boolean | null = loadingStatesCategory.some(
    (loadingState: boolean | null) => loadingState
  );

  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<any, any>>();

  const fetchCategoriesData = (): void => {
    dispatch(fetchCategoriesThunk());
  };

  const fetchProductsByCategoryData = (isRefreshing: boolean = false): void => {
    if (isRefreshing) {
      setProductCurrentPage(1);
    }

    dispatch(
      fetchProductsByCategoryThunk({
        category: chosen._id,
        limit: LIMIT_NUMBER,
        page: currentProductPage,
      })
    ).then(() => {
      setIsLoadingMore(false);
    });
  };

  // Fetch categories data on component mount
  React.useEffect((): void => {
    fetchCategoriesData();
  }, [isLoadingCategory]);

  // Update header title and fetch products by category data when 'chosen' category changes
  React.useLayoutEffect((): void => {
    navigation.setOptions({
      headerTitle: chosen.title || 'Ապրանքներ',
    });
    fetchProductsByCategoryData();
    setProductCurrentPage(1);
  }, [chosen]);

  // Fetch products by category data on component mount, page change, or loading state change
  React.useEffect((): void => {
    executeAfterDeviceCheck(fetchProductsByCategoryData);
  }, [currentProductPage, isLoading, isTablet]);

  const handleLoadMore = () => {
    if (currentProductPage * LIMIT_NUMBER < productsByCategory.total_items && !isLoadingMore) {
      setIsLoadingMore(true);
      setProductCurrentPage((prevPage: number) => prevPage + 1);
    }
  };
  // Function to handle manual data refresh
  const handleRefresh = (): void => {
    fetchProductsByCategoryData(true);
  };

  const isNetworkError: boolean = categories.isNetworkError || productsByCategory.isNetworkError;
  const isTechnicalError: boolean = categories.isError || productsByCategory.isError;

  return (categories.isLoading && productsByCategory.isLoading) || isTablet === null ? (
    <Loading />
  ) : (
    <SafeAreaView style={{ flex: 1 }}>
      {isNetworkError || isTechnicalError ? (
        <NetworkError
          handleRefresh={handleRefresh}
          type={isTechnicalError ? ETypeError.TECHNICAL : ETypeError.NETWORK}
        />
      ) : (
        <View className="h-full flex-1 flex-row justify-between">
          <View className="items-center bg-white">
            <FlatList
              data={categories.items}
              renderItem={({ item }) => (
                <ProductCategoryItem
                  item={item}
                  key={item._id}
                  setProductCurrentPage={setProductCurrentPage}
                />
              )}
            />
          </View>
          <View className="m-2 mt-1 ml-0.5 w-full flex-1">
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={productsByCategory.isLoading as boolean}
                  onRefresh={handleRefresh}
                />
              }
              data={productsByCategory.items}
              horizontal={false}
              numColumns={2}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              renderItem={({ index, item }) => (
                <ProductItem
                  index={index}
                  item={item}
                  className="pt-0"
                  imageClassName="w-28 h-28 mt-[20px]"
                  height={24}
                  isLastInRow={
                    productsByCategory.items.length % 2 === 1 &&
                    index === productsByCategory.items.length - 1
                  }
                />
              )}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={isLoadingMore ? <ScrollLoader /> : null}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};
