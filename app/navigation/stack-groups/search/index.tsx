import React from 'react';
import { ProductPage, Search } from '../../../components/screens';
import { MyPageStack } from './../../stack';

export const SearchPageStackGroup = () => {
  return (
    <MyPageStack.Navigator>
      <MyPageStack.Screen
        name="Փնտրել"
        component={Search}
        options={{
          title: 'Փնտրել',
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
