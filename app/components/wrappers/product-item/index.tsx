import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { IProductItem } from '../../../types';
import { API_URL } from '../../../utils/constants';
import { calculateDiscountedPrice, formattedPrice } from '../../../utils/product';
import { TProductItemParamList } from '../../screens/home/types';
import { SaleIcon } from '../sale-icon';

export const ProductItem: React.FC<IProductItem> = React.memo((props) => {
  const { item, index, isLastInRow, imageClassName, height } = props;
  const { navigate } = useNavigation<NavigationProp<TProductItemParamList>>();

  const handleNavigate = (): void => {
    navigate('product', { item });
  };
  const checkDiscount: boolean = item.discount > 0;
  return (
    <View
      key={item._id}
      className={`bg-white rounded${!isLastInRow ? ' w-full flex-1' : ' flex-[0.5]'}`}
      style={{
        marginRight: index % 2 !== 0 ? 0 : 5,
        marginLeft: index % 2 !== 0 ? 0 : 5,
      }}>
      <TouchableOpacity onPress={handleNavigate} className="w-full">
        <View className="flex-1 items-center relative">
          <Image
            source={{ uri: `${API_URL}/${item.picture}` ?? '' }}
            alt={item._id}
            className={`w-36 h-36 ${imageClassName}`}
          />
          {checkDiscount ? <SaleIcon discount={item.discount} /> : null}
        </View>
        <View className={`p-3 gap-1 justify-between h-24 h-${height}`}>
          <View>
            <Text className="max-w-[160px]">{item.title}</Text>
          </View>
          <View>
            {checkDiscount ? (
              <>
                <Text className="text-gray-600 line-through">{formattedPrice(item.price)} ․դր</Text>
                <Text className="text-red-500">
                  {formattedPrice(calculateDiscountedPrice(item.price, item.discount))} ․դր
                </Text>
              </>
            ) : (
              <Text className="text-red-500">{formattedPrice(item.price)} ․դր</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
});
ProductItem.displayName = 'ProductItem';
