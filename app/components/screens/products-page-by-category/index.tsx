import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

import { TCategoryRouteParams } from './types';

export const ProductsPageByCategory = () => {
  const navigation = useNavigation<NavigationProp<any, any>>();
  const route = useRoute();
  const { categoryTitle }: TCategoryRouteParams = route.params as TCategoryRouteParams;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: categoryTitle,
    });
  }, []);
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text>{categoryTitle}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
