import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { useDebounce } from '../../../hooks/useDebounce';
import { useIsTablet } from '../../../hooks/useIsTablet';
import { searchProductsThunk } from '../../../redux/http/productThunk';
import { clearSearchQuery, setSearchQuery } from '../../../redux/reducers/product/productSlice';
import { TProduct } from '../../../redux/types';
import { ETypeError } from '../../../types';
import { getLimitNumber } from '../../../utils/constants';
import { Loading, NetworkError } from '../../ui';
import { PaginationButtons, ProductItem } from '../../wrappers';
import { SearchByBarCode } from './ui';

export const Search = () => {
  const dispatch = useAppDispatch();
  const { isTablet, executeAfterDeviceCheck } = useIsTablet();
  const LIMIT_NUMBER = getLimitNumber(isTablet);

  // Redux state selectors for product search and order-related states
  const {
    search,
    searchQuery,
    create: createProduct,
    createByDocument,
    update: updateProduct,
    delete: deleteProduct,
  } = useAppSelector((state) => state.product);
  const [initialSearch, setInitialSearch] = React.useState<boolean>(false);

  // State to track the current page for fetching products by category
  const [currentSearchProductPage, setSearchProductCurrentPage] = React.useState<number>(1);

  // Redux state selectors for order-related states
  const {
    deleteItem,
    create: createOrder,
    changeStatus,
    toOrder,
  } = useAppSelector((state) => state.order);

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

  // Custom hook for debouncing the search query
  const debouncedSearch: string = useDebounce(searchQuery, 500);

  const fetchSearchData = (): void => {
    dispatch(
      searchProductsThunk({
        query: debouncedSearch,
        limit: LIMIT_NUMBER,
        page: 0,
      })
    );
  };

  const fetchData = (): void => {
    dispatch(
      searchProductsThunk({
        query: searchQuery,
        limit: LIMIT_NUMBER,
        page: currentSearchProductPage,
      })
    );
  };

  // Effect to trigger searchProductsThunk when search query changes or initial search is true

  React.useEffect((): void => {
    executeAfterDeviceCheck(fetchSearchData);
  }, [debouncedSearch, isTablet]);

  React.useEffect((): void => {
    executeAfterDeviceCheck(fetchData);
  }, [initialSearch, isLoading, currentSearchProductPage, isTablet]);

  const handleSearchChange = (text: string): void => {
    // Dispatch action to set the search query and indicate an initial search
    if (!initialSearch) {
      setInitialSearch(true);
    }
    if (currentSearchProductPage !== 1) {
      setSearchProductCurrentPage(1);
    }
    dispatch(setSearchQuery(text));
  };

  // Function to clear the search query
  const handleClearSearch = (): void => {
    dispatch(clearSearchQuery());
  };

  const handleRefresh = (): void => {
    fetchData();
  };

  const handlePrevProductPage = (): void => {
    if (currentSearchProductPage > 1) {
      setSearchProductCurrentPage((prevPage: number) => prevPage - 1);
    }
  };

  // Function to handle moving to the next page of products
  const handleNextProductPage = (): void => {
    if (currentSearchProductPage * LIMIT_NUMBER < search.total_items) {
      setSearchProductCurrentPage((prevPage: number) => prevPage + 1);
    }
  };

  const { isNetworkError, isError: isTechnicalError } = search || {};
  const isError: boolean = isNetworkError || isTechnicalError;

  const previousButtonDisable: boolean = currentSearchProductPage <= 1;
  const nextButtonDisable: boolean = currentSearchProductPage * LIMIT_NUMBER >= search.total_items;
  const totalCurrentPage: number = search.items.length;

  return (search.isLoading && !initialSearch) || isTablet === null ? (
    <Loading />
  ) : (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={search.isLoading as boolean} onRefresh={handleRefresh} />
        }
        style={{
          minHeight: '100%',
        }}
        keyboardShouldPersistTaps="handled">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View className="p-4">
            <View className="flex-row">
              <View className="relative flex-1 justify-center">
                <TextInput
                  className="p-3 pr-9 rounded-lg border border-gray-500"
                  placeholder="Փնտրել"
                  value={searchQuery}
                  onChangeText={handleSearchChange}
                />
                <View className="absolute right-3">
                  {searchQuery.length !== 0 ? (
                    <TouchableOpacity onPress={handleClearSearch}>
                      <AntDesign name="close" size={21} color="gray" />
                    </TouchableOpacity>
                  ) : (
                    <View>
                      <AntDesign name="search1" size={21} color="gray" />
                    </View>
                  )}
                </View>
              </View>
              <SearchByBarCode handleSearchChange={handleSearchChange} />
            </View>
            {isError ? (
              <NetworkError
                handleRefresh={handleRefresh}
                type={isTechnicalError ? ETypeError.TECHNICAL : ETypeError.NETWORK}
              />
            ) : (
              <View className="mt-5">
                {!Array.isArray(search.items) ||
                (search.isLoading !== null && search.items.length === 0) ? (
                  <View className="items-center">
                    <Image
                      source={require('./../../../assets/images/products/sad-search.png')}
                      alt="products are not found"
                      className="w-52 h-52"
                    />
                    <Text className="text-center text-xl text-orange-500 font-bold w-full">
                      Չի գտնվել ապրանք այդպիսի անվանումով
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    scrollEnabled={false}
                    data={search.items}
                    ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                    renderItem={({ index, item }) => (
                      <ProductItem
                        item={item}
                        index={index}
                        key={item._id}
                        isLastInRow={totalCurrentPage % 2 === 1 && index === totalCurrentPage - 1}
                      />
                    )}
                    numColumns={2}
                    horizontal={false}
                    keyExtractor={(item: TProduct) => item._id}
                  />
                )}
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
        <PaginationButtons
          total_items={search.total_items}
          previousButtonDisable={previousButtonDisable}
          nextButtonDisable={nextButtonDisable}
          handlePrevPage={handlePrevProductPage}
          handleNextPage={handleNextProductPage}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
