import React from 'react';
import {
  AboutApp,
  LastOrders,
  Profile,
  UserCreateEdit,
  UserPasswordEdit,
} from '../../../../components/screens';

import {
  OrderAdminViewPageStackGroup,
  OrderViewPageStackGroup,
  OrdersCompletedPageStackGroup,
} from '../../';
import { MyPageStack } from './../../../stack';

export const ProfileStackGroup = () => {
  return (
    <MyPageStack.Navigator>
      <MyPageStack.Screen
        name="profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
      <MyPageStack.Screen
        name="lastOrders"
        component={LastOrders}
        options={{
          title: 'Վերջին պատվերներ',
        }}
      />
      <MyPageStack.Screen
        name="allOrders"
        component={OrderViewPageStackGroup}
        options={{
          title: 'Պատվերներ',
        }}
      />
      <MyPageStack.Screen
        name="adminOrders"
        component={OrderAdminViewPageStackGroup}
        options={{
          title: 'Ադմինիստրային պատվերներ',
        }}
      />
      <MyPageStack.Screen
        name="ordersCompleted"
        component={OrdersCompletedPageStackGroup}
        options={{
          title: 'Պատվերների պատմություն',
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
        name="userPasswordEdit"
        component={UserPasswordEdit}
        options={{
          title: 'Փոփոխել գաղտաբառը',
          presentation: 'modal',
          headerTitleStyle: { fontSize: 14 },
        }}
      />
      <MyPageStack.Screen
        name="aboutApp"
        component={AboutApp}
        options={{
          title: 'Ծրագրի մասին',
          presentation: 'modal',
          headerTitleStyle: { fontSize: 14 },
        }}
      />
    </MyPageStack.Navigator>
  );
};
