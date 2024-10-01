import React from 'react';
import { AboutApp, Home, ProductPage, ProductsPageByCategory } from '../../../components/screens';
import { MyPageStack } from './../../stack';

export const HomePageStackGroup = () => {
  return (
    <MyPageStack.Navigator>
      <MyPageStack.Screen
        name="home"
        component={Home}
        options={{
          title: 'Գլխավոր',
        }}
      />
      <MyPageStack.Screen
        name="about-app"
        component={AboutApp}
        options={{
          title: 'Ծրագրի մասին',
        }}
      />
      <MyPageStack.Screen
        name="product"
        component={ProductPage}
        options={{
          title: 'Ապրանք',
        }}
      />

      <MyPageStack.Screen
        name="byFilter"
        component={ProductsPageByCategory}
        options={{
          presentation: 'modal',
          title: 'Ըստ կատեգորիայի',
        }}
      />
    </MyPageStack.Navigator>
  );
};
