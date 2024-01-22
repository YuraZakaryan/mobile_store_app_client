import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  Image,
  Keyboard,
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
import { Loading } from '../../ui';
import { ProductItem } from '../../wrappers';

export const Search = () => {
  const dispatch = useAppDispatch();
  const { search, searchQuery } = useAppSelector((state) => state.product);
  const [initialSearch, setInitialSearch] = React.useState<boolean>(false);
  const { deleteItem, create, changeStatus, toOrder } = useAppSelector((state) => state.order);
  const isLoading: boolean =
    create.isLoading || deleteItem.isLoading || changeStatus.isLoading || toOrder.isLoading;

  const debouncedSearch = useDebounce(searchQuery, 500);

  React.useEffect(() => {
    dispatch(searchProductsThunk({ query: debouncedSearch }));
  }, [initialSearch, debouncedSearch, isLoading]);

  const handleSearchChange = (text: string): void => {
    dispatch(setSearchQuery(text));
    setInitialSearch(true);
  };

  const handleClearSearch = (): void => {
    dispatch(clearSearchQuery());
  };

  return search.isLoading && !initialSearch ? (
    <Loading />
  ) : (
    <SafeAreaView>
      <ScrollView
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
            <View className="mt-5">
              {!Array.isArray(search.items) || (!search.isLoading && search.items.length === 0) ? (
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
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
};
