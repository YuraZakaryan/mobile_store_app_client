import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, RefreshControl, ScrollView, Text, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { useDebounce } from '../../../../hooks/useDebounce';
import { fetchCategoriesThunk } from '../../../../redux/http/categoryThunk';
import { fetchControlProductsThunk } from '../../../../redux/http/productThunk';
import { TProduct } from '../../../../redux/types';
import { SHOW_ERROR } from '../../../../toasts';
import { API_URL, LIMIT_NUMBER } from '../../../../utils/constants';
import { Loading } from '../../../ui';
import { CreateItemButton, CrudList, Main } from '../../../wrappers';

export const ProductsControl = () => {
  const dispatch = useAppDispatch();
  const {
    productsControl: products,
    create,
    update,
    delete: deleteProduct,
  } = useAppSelector((state) => state.product);
  const { categories } = useAppSelector((state) => state.category);
  const { navigate } = useNavigation<NavigationProp<ParamListBase>>();
  const [hasSearched, setHasSearched] = React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [currentProductPage, setProductCurrentPage] = React.useState<number>(1);
  const isLoading = create.isLoading || update.isLoading || deleteProduct.isLoading;

  const debouncedSearch: string = useDebounce(searchQuery, 500);

  const fetchData = (): void => {
    dispatch(
      fetchControlProductsThunk({
        page: currentProductPage,
        limit: LIMIT_NUMBER,
        query: debouncedSearch,
      })
    );
    dispatch(fetchCategoriesThunk({}));
  };

  React.useEffect((): void => {
    fetchData();
  }, [currentProductPage, debouncedSearch, isLoading]);

  const handlePrevProductPage = (): void => {
    if (currentProductPage > 1) {
      setProductCurrentPage((prevPage: number) => prevPage - 1);
    }
  };

  const handleNextProductPage = (): void => {
    const totalProducts: number = products.total_items;
    if (currentProductPage * LIMIT_NUMBER < totalProducts) {
      setProductCurrentPage((prevPage: number) => prevPage + 1);
    }
  };

  const handleClick = (): void => {
    if (categories.total_items === 0) {
      SHOW_ERROR('Առաջին հերթին ստեղծել կատեգորիա');
    } else {
      navigate('productCreateEdit');
    }
  };

  const handleRefresh = (): void => {
    fetchData();
  };

  return products.isLoading && !hasSearched ? (
    <Loading />
  ) : (
    <Main>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={products.isLoading as boolean} onRefresh={handleRefresh} />
        }
        keyboardShouldPersistTaps="handled">
        <View className="m-4">
          {products.total_items > 0 || hasSearched ? (
            <CrudList
              labelList="Ապրանքներ"
              data={products.items}
              navigateTo="productCreateEdit"
              previousButtonDisable={currentProductPage <= 1}
              nextButtonDisable={currentProductPage * LIMIT_NUMBER >= products.total_items}
              handlePreviousPage={handlePrevProductPage}
              handleNextPage={handleNextProductPage}
              totalItems={products.total_items}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              hasSearched={hasSearched}
              setHasSearched={setHasSearched}
              renderItemComponent={(index: number, item: TProduct) => (
                <>
                  <View className="flex-row items-center gap-2">
                    <Text className="font-semibold">{index + 1}.</Text>
                    <Text className="min-w-[85px] w-36" numberOfLines={1} ellipsizeMode="tail">
                      {item.title}
                    </Text>
                  </View>
                  {item.picture && (
                    <Image
                      source={{ uri: `${API_URL + '/' + item.picture}` }}
                      alt={item.title}
                      className="w-10 h-10 rounded"
                    />
                  )}
                </>
              )}
            />
          ) : null}

          <CreateItemButton handleClick={handleClick} createButtonLabel="Ստեղծել ապրանք" />
        </View>
      </ScrollView>
    </Main>
  );
};
