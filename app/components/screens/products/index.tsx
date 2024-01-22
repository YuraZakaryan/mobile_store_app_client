import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, RefreshControl, SafeAreaView, View } from 'react-native';

import { ProductCategoryItem } from './wrapper';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { fetchCategoriesThunk } from '../../../redux/http/categoryThunk';
import { fetchProductsByCategoryThunk } from '../../../redux/http/productThunk';
import { LIMIT_NUMBER } from '../../../utils/constants';
import { Loading } from '../../ui';
import { PaginationButtons, ProductItem } from '../../wrappers';

export const Products = () => {
  const { chosen } = useAppSelector((state) => state.category);
  const { categories } = useAppSelector((state) => state.category);
  const { deleteItem, create, changeStatus, toOrder } = useAppSelector((state) => state.order);

  const { productsByCategory } = useAppSelector((state) => state.product);
  const [currentProductPage, setProductCurrentPage] = React.useState<number>(1);

  const isLoading: boolean =
    create.isLoading || deleteItem.isLoading || changeStatus.isLoading || toOrder.isLoading;

  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<any, any>>();
  const fetchCategoriesData = (): void => {
    dispatch(fetchCategoriesThunk({}));
  };
  const fetchProductsByCategoryData = (): void => {
    dispatch(
      fetchProductsByCategoryThunk({
        category: chosen._id,
        limit: LIMIT_NUMBER,
        page: currentProductPage,
      })
    );
  };

  React.useEffect((): void => {
    fetchCategoriesData();
  }, []);

  React.useLayoutEffect((): void => {
    navigation.setOptions({
      headerTitle: chosen.title || 'Ապրանքներ',
    });
    fetchProductsByCategoryData();
    setProductCurrentPage(1);
  }, [chosen]);

  React.useEffect((): void => {
    fetchProductsByCategoryData();
  }, [currentProductPage, isLoading]);

  const handlePrevProductPage = (): void => {
    if (currentProductPage > 1) {
      setProductCurrentPage((prevPage: number) => prevPage - 1);
    }
  };

  const handleNextProductPage = (): void => {
    if (currentProductPage * LIMIT_NUMBER < productsByCategory.total_items) {
      setProductCurrentPage((prevPage: number) => prevPage + 1);
    }
  };
  const previousButtonDisable: boolean = currentProductPage <= 1;
  const nextButtonDisable: boolean =
    currentProductPage * LIMIT_NUMBER >= productsByCategory.total_items;

  const handleRefresh = (): void => {
    fetchProductsByCategoryData();
  };

  return categories.isLoading && productsByCategory.isLoading ? (
    <Loading />
  ) : (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="h-full flex-1 flex-row justify-between">
        <View className="items-center bg-white">
          <FlatList
            data={categories.items}
            renderItem={({ item }) => <ProductCategoryItem item={item} key={item._id} />}
          />
        </View>
        <View className="m-2 mt-1 ml-0.5 w-full flex-1">
          <FlatList
            refreshControl={
              <RefreshControl refreshing={productsByCategory.isLoading} onRefresh={handleRefresh} />
            }
            data={productsByCategory.items}
            horizontal={false}
            numColumns={2}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={({ index, item }) => (
              <ProductItem
                index={index}
                item={item}
                imageClassName="w-28 h-28 mt-[20px]"
                height={24}
                isLastInRow={
                  productsByCategory.items.length % 2 === 0 ||
                  index === productsByCategory.items.length - 1
                }
              />
            )}
          />
          <PaginationButtons
            total_items={productsByCategory.total_items}
            previousButtonDisable={previousButtonDisable}
            nextButtonDisable={nextButtonDisable}
            handlePrevPage={handlePrevProductPage}
            handleNextPage={handleNextProductPage}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
