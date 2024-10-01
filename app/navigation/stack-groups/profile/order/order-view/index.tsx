import React from 'react';
import { OrdersControl, OrderView } from '../../../../../components/screens';
import { MyPageStack } from './../../../../stack';

export const OrderViewPageStackGroup = () => {
  return (
    <MyPageStack.Navigator>
      <MyPageStack.Screen
        name="orders-control"
        component={OrdersControl}
        options={{
          headerShown: false,
        }}
      />
      <MyPageStack.Screen
        name="order-view"
        component={OrderView}
        options={{
          headerShown: false,
          presentation: 'modal',
          headerTitleStyle: { fontSize: 14 },
        }}
      />
    </MyPageStack.Navigator>
  );
};
