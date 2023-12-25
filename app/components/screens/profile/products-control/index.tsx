import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';

import { useAppSelector } from '../../../../hooks/redux';
import { TProduct } from '../../../../redux/types';
import { CreateItemButton, CrudList, Main } from '../../../wrappers';

export const ProductsControl = () => {
  const { items } = useAppSelector((state) => state.product);
  const { navigate } = useNavigation<NavigationProp<ParamListBase>>();

  const handleClick = () => {
    navigate('productCreateEdit');
  };

  return (
    <Main>
      <ScrollView>
        <View className="m-4">
          <CrudList
            labelList="Ապրանքներ"
            data={items}
            navigateTo="productCreateEdit"
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
                    source={{ uri: item.picture ?? '' }}
                    className="w-10 h-10 rounded"
                    alt={item.title}
                  />
                )}
              </>
            )}
          />
          <CreateItemButton handleClick={handleClick} createButtonLabel="Ստեղծել ապրանք" />
        </View>
      </ScrollView>
    </Main>
  );
};
