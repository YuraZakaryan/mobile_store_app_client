import React from 'react';
import { CategoriesControl, CategoryCreateEdit } from '../../../../components/screens';
import { MyPageStack } from '../../../stack';

export const CategoriesControlPageStackGroup = () => {
  return (
    <MyPageStack.Navigator>
      <MyPageStack.Screen
        name="categories-control"
        component={CategoriesControl}
        options={{
          headerShown: false,
        }}
      />
      <MyPageStack.Screen
        name="categoryCreateEdit"
        component={CategoryCreateEdit}
        options={{
          title: 'Փոփոխել կատեգորիան',
          presentation: 'modal',
          headerTitleStyle: { fontSize: 14 },
        }}
      />
    </MyPageStack.Navigator>
  );
};
