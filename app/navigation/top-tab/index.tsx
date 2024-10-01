import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import {
  CategoriesControlPageStackGroup,
  ProductsControlPageStackGroup,
  UsersControlPageStackGroup,
} from '../stack-groups';
import { ProfileStackGroup } from '../stack-groups/profile/main';

const TopTabs = createMaterialTopTabNavigator();

export const TopTabsGroup = () => {
  return (
    <TopTabs.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarLabelStyle: {
          textTransform: 'capitalize',
          fontWeight: 'bold',
          flexDirection: 'row',
        },
      }}>
      <TopTabs.Screen
        name="profileTop"
        component={ProfileStackGroup}
        options={{
          title: 'Գլխավոր',
        }}
      />
      <TopTabs.Screen
        name="productsGroup"
        component={ProductsControlPageStackGroup}
        options={{
          title: 'Ապրանքներ',
        }}
      />
      <TopTabs.Screen
        name="categoriesGroup"
        component={CategoriesControlPageStackGroup}
        options={{
          title: 'Կատեգորիաներ',
        }}
      />

      <TopTabs.Screen
        name="usersGroup"
        component={UsersControlPageStackGroup}
        options={{
          title: 'Հաճախորդներ',
        }}
      />
    </TopTabs.Navigator>
  );
};
