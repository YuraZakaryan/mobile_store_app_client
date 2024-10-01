import React from 'react';

import { ProductCreateEdit, ProductsControl } from '../../../../components/screens';
import { MyPageStack } from './../../../stack';

export const ProductsControlPageStackGroup = () => {
  return (
    <MyPageStack.Navigator>
      <MyPageStack.Screen
        name="products-control"
        component={ProductsControl}
        options={{
          headerShown: false,
        }}
      />
      <MyPageStack.Screen
        name="productCreateEdit"
        component={ProductCreateEdit}
        options={{
          title: 'Փոփոխել ապրանքը',
          presentation: 'modal',
          headerTitleStyle: { fontSize: 14 },
        }}
      />
    </MyPageStack.Navigator>
  );
};
