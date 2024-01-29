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
import { searchProductsThunk } from '../../../redux/http/productThunk';
import { clearSearchQuery, setSearchQuery } from '../../../redux/reducers/product/productSlice';
import { TProduct } from '../../../redux/types';
import { ETypeError } from '../../../types';
import { Loading, NetworkError } from '../../ui';
import { ProductItem } from '../../wrappers';

export const Search = () => {
  const dispatch = useAppDispatch();

  // Redux state selectors for product search and order-related states
  const { search, searchQuery } = useAppSelector((state) => state.product);
  const [initialSearch, setInitialSearch] = React.useState<boolean>(false);

  // Redux state selectors for order-related states
  const { deleteItem, create, changeStatus, toOrder } = useAppSelector((state) => state.order);

  // Determine overall loading status for multiple order-related actions
  const isLoading: boolean =
    create.isLoading || deleteItem.isLoading || changeStatus.isLoading || toOrder.isLoading;
  // Custom hook for debouncing the search query
  const debouncedSearch = useDebounce(searchQuery, 500);

  const fetchDataByQuery = () => {
    dispatch(searchProductsThunk({ query: debouncedSearch }));
  };
  // Effect to trigger searchProductsThunk when search query changes or initial search is true
  React.useEffect(() => {
    fetchDataByQuery();
  }, [initialSearch, debouncedSearch, isLoading]);

  const handleSearchChange = (text: string): void => {
    // Dispatch action to set the search query and indicate an initial search
    dispatch(setSearchQuery(text));
    setInitialSearch(true);
  };

  // Function to clear the search query
  const handleClearSearch = (): void => {
    dispatch(clearSearchQuery());
  };

  const handleRefresh = (): void => {
    fetchDataByQuery();
  };

  const hasNetworkError: boolean = search.isNetworkError;
  const hasError: boolean = search.isError;

  return search.isLoading && !initialSearch ? (
    <Loading />
  ) : (
    <SafeAreaView>
      <ScrollView
        refreshControl={<RefreshControl refreshing={search.isLoading} onRefresh={handleRefresh} />}
        style={{
          minHeight: '100%',
        }}
        keyboardShouldPersistTaps="handled">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View className="p-4">
            <View className="relative flex-1 justify-center">
              <TextInput
                className="p-3 pr-9 rounded-lg border border-gray-500"
                placeholder="Փնտրել"
                value={searchQuery}
                onChangeText={handleSearchChange}
              />
              {hasError ? (
                <NetworkError
                  handleRefresh={handleRefresh}
                  type={hasNetworkError ? ETypeError.NETWORK : ETypeError.TECHNICAL}
                />
              ) : (
                <>
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
                  <View className="mt-5">
                    {!Array.isArray(search.items) ||
                    (!search.isLoading && search.items.length === 0) ? (
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
                            isLastInRow={
                              search.items.length % 2 === 0 || index === search.items.length - 1
                            }
                          />
                        )}
                        numColumns={2}
                        horizontal={false}
                        keyExtractor={(item: TProduct) => item._id}
                      />
                    )}
                  </View>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
};
