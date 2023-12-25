import { EvilIcons, AntDesign } from '@expo/vector-icons';
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
import { clearSearchQuery, setSearchQuery } from '../../../redux/reducers/product/productSlice';
import { TProduct } from '../../../redux/types';
import { ProductItem } from '../../wrappers';

export const Search = () => {
  const dispatch = useAppDispatch();
  const { search } = useAppSelector((state) => state.product);

  const handleSearchChange = (text: string) => {
    dispatch(setSearchQuery(text));
  };

  const handleClearSearch = () => {
    dispatch(clearSearchQuery());
  };

  return (
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
                value={search.query}
                onChangeText={handleSearchChange}
              />
              <View className="absolute right-3">
                {search.query.length !== 0 ? (
                  <TouchableOpacity onPress={handleClearSearch}>
                    <AntDesign name="close" size={19} color="gray" />
                  </TouchableOpacity>
                ) : (
                  <EvilIcons name="search" size={24} color="gray" />
                )}
              </View>
            </View>
            <View className="mt-5">
              <FlatList
                scrollEnabled={false}
                data={search.items}
                ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                renderItem={({ index, item }) => (
                  <ProductItem
                    item={item}
                    index={index}
                    key={item._id}
                    isLastInRow={index === search.items.length - 1}
                  />
                )}
                numColumns={2}
                horizontal={false}
                keyExtractor={(item: TProduct) => item._id}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
};
