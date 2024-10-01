import React from 'react';
import { ProductPage, Products } from '../../../components/screens';
import { MyPageStack } from './../../stack';

export const ProductsPageStackGroup = () => {
  return (
    <MyPageStack.Navigator>
      <MyPageStack.Screen
        name="Ապրանքներ"
        component={Products}
        options={{
          title: 'Ապրանքներ',
        }}
      />
      <MyPageStack.Screen
        name="product"
        component={ProductPage}
        options={{
          title: 'Ապրանք',
        }}
      />
    </MyPageStack.Navigator>
  );
};
