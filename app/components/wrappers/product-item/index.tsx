import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { useAppDispatch } from '../../../hooks/redux';
import { updateCurrentProduct } from '../../../redux/reducers/product/productSlice';
import { IProductItem } from '../../../types';
import { API_URL } from '../../../utils/constants';
import { formattedPrice } from '../../../utils/product';
import { TProductItemParamList } from '../../screens/home/types';

export const ProductItem: React.FC<IProductItem> = React.memo((props) => {
  const dispatch = useAppDispatch();
  const { item, index, isLastInRow, imageClassName, className, height } = props;
  const { navigate } = useNavigation<NavigationProp<TProductItemParamList>>();

  const handleNavigate = (): void => {
    dispatch(updateCurrentProduct(null));
    navigate('product', { title: item.title, productId: item._id });
  };

  const imageUrl = item.picture
    ? item.picture.includes('https')
      ? item.picture
      : { uri: item.picture && `${API_URL}/${item.picture}` }
    : require('./../../../assets/images/no_image.jpg');

  return (
    <View
      key={item._id}
      className={`bg-white pt-3.5 rounded${!isLastInRow ? ' w-full flex-1' : ' flex-[0.5]'} ${className ? className : ''}`}
      style={{
        marginRight: index % 2 !== 0 ? 0 : 5,
        marginLeft: index % 2 !== 0 ? 0 : 5,
      }}>
      <TouchableOpacity onPress={handleNavigate} className="w-full">
        <View className="items-center">
          <Image source={imageUrl} alt={item.title} className={`w-32 h-32 ${imageClassName}`} />
        </View>
        <View className={`p-3 gap-1 justify-between h-24 h-${height}`}>
          <View>
            <Text numberOfLines={2} className="max-w-[160px]">
              {item.title}
            </Text>
          </View>
          <View>
            <Text className="text-red-500">{formattedPrice(item.price)} ․դր</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
});
ProductItem.displayName = 'ProductItem';
