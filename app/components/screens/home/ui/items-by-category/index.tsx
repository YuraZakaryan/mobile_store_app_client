import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import { TProduct } from '../../../../../redux/types';
import { ProductItem } from '../../../../wrappers';
import { IItemsByCategory, THomeStackParamList } from '../../types';

export const ItemsByCategory: React.FC<IItemsByCategory> = React.memo((props) => {
  const { categoryTitle, products, icon } = props;
  const { navigate } = useNavigation<NavigationProp<THomeStackParamList>>();

  const handleNavigate = (): void => {
    navigate('byFilter', { categoryTitle });
  };
  return (
    <View className="mt-3">
      <View>
        <View className="flex-1 items-center flex-row">
          {icon}
          <View className="justify-center flex-row ml-3">
            <Text className="uppercase text-lg text-blue-600">{categoryTitle.charAt(0)}</Text>
            <Text className="text-lg text-blue-600">{categoryTitle.slice(1)}</Text>
          </View>
        </View>
      </View>
      <View className="mt-5">
        <FlatList
          scrollEnabled={false}
          data={products}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          renderItem={({ index, item }) => (
            <ProductItem
              item={item}
              index={index}
              isLastInRow={products.length % 2 === 0 || index === products.length - 1}
              key={item._id}
            />
          )}
          numColumns={2}
          horizontal={false}
          keyExtractor={(item: TProduct) => item._id}
        />
        <TouchableOpacity className="flex-row justify-end mt-4" onPress={handleNavigate}>
          <Text className="text-gray-600 underline">Տեսնել բոլորը</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});
ItemsByCategory.displayName = 'ItemsByCategory';
