import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';

import { ProductCategoryItem } from './wrapper';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { setCategory } from '../../../redux/reducers/category/categorySlice';
import { ProductItem } from '../../wrappers';

export const Products = () => {
  const { chosen } = useAppSelector((state) => state.category);
  const { items: categoryItems } = useAppSelector((state) => state.category);
  const { items: productItems } = useAppSelector((state) => state.product);

  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<any, any>>();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: chosen.title || 'Ապրանքներ',
    });
  }, [chosen]);

  React.useEffect(() => {
    dispatch(setCategory({ _id: categoryItems[0]._id, title: categoryItems[0].title }));
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="h-full flex-1 flex-row justify-between">
        <View className="items-center bg-white">
          <FlatList
            data={categoryItems}
            renderItem={({ item }) => <ProductCategoryItem item={item} key={item._id} />}
          />
        </View>
        <View className="m-2 mt-1 ml-0.5 w-full flex-1">
          <FlatList
            data={productItems}
            horizontal={false}
            numColumns={2}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={({ index, item }) => (
              <ProductItem
                index={index}
                item={item}
                imageClassName="w-[136px] h-[136px]"
                height={24}
                isLastInRow={index === productItems.length - 1}
              />
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
