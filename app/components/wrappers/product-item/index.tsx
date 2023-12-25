import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { IProductItem } from '../../../types';
import { TProductItemParamList } from '../../screens/home/types';

export const ProductItem: React.FC<IProductItem> = React.memo((props) => {
  const { item, index, isLastInRow, imageClassName, height } = props;
  const { navigate } = useNavigation<NavigationProp<TProductItemParamList>>();

  const handleNavigate = (): void => {
    navigate('product', { item });
  };

  return (
    <View
      key={item._id}
      className={`bg-white rounded${!isLastInRow ? ' w-full flex-1' : ' flex-[0.5]'}`}
      style={{
        marginRight: index % 2 !== 0 ? 0 : 5,
        marginLeft: index % 2 !== 0 ? 0 : 5,
      }}>
      <TouchableOpacity onPress={handleNavigate} className="w-full">
        <View className="flex-1 items-center">
          <Image
            source={require('./../../../assets/images/products/iphone.png')}
            alt={item._id}
            className={`w-36 h-36 ${imageClassName}`}
          />
        </View>
        <View className={`p-3 gap-1 justify-between h-20 h-${height}`}>
          <View>
            <Text className="max-w-[160px]">{item.title}</Text>
          </View>
          <View>
            <Text className="text-red-500">{item.price} ․դր</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
});
ProductItem.displayName = 'ProductItem';
