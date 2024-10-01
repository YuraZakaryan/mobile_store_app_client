import React from 'react';
import { CategoryCreateEdit, UserCreateEdit, UsersControl } from '../../../../components/screens';
import { MyPageStack } from '../../../stack';

export const UsersControlPageStackGroup = () => {
  return (
    <MyPageStack.Navigator>
      <MyPageStack.Screen
        name="users-control"
        component={UsersControl}
        options={{
          headerShown: false,
        }}
      />
      <MyPageStack.Screen
        name="userCreateEdit"
        component={UserCreateEdit}
        options={{
          title: 'Փոփոխել հաճախորդին',
          presentation: 'modal',
          headerTitleStyle: { fontSize: 14 },
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
