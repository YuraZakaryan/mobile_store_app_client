import React from 'react';
import { OrderCompletedView, OrdersCompleted } from '../../../../../components/screens';
import { MyPageStack } from './../../../../stack';

export const OrdersCompletedPageStackGroup = () => {
  return (
    <MyPageStack.Navigator>
      <MyPageStack.Screen
        name="orders-completed"
        component={OrdersCompleted}
        options={{
          headerShown: false,
        }}
      />
      <MyPageStack.Screen
        name="order-completed-view"
        component={OrderCompletedView}
        options={{
          headerShown: false,
          presentation: 'modal',
          headerTitleStyle: { fontSize: 14 },
        }}
      />
    </MyPageStack.Navigator>
  );
};
