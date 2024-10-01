import React from 'react';
import { OrderAdminEdit, OrdersAdminControl } from '../../../../../components/screens';
import { MyPageStack } from './../../../../stack';

export const OrderAdminViewPageStackGroup = () => {
  return (
    <MyPageStack.Navigator>
      <MyPageStack.Screen
        name="orders-admin-control"
        component={OrdersAdminControl}
        options={{
          headerShown: false,
        }}
      />
      <MyPageStack.Screen
        name="admin-order-edit"
        component={OrderAdminEdit}
        options={{
          headerShown: false,
          presentation: 'modal',
          headerTitleStyle: { fontSize: 14 },
        }}
      />
    </MyPageStack.Navigator>
  );
};
