import React from 'react';

import { ResetPassword } from '../../../components/screens';
import { Auth } from '../../../components/screens/auth';
import { MyPageStack } from './../../stack';

export const AuthPageStackGroup = () => {
  return (
    <MyPageStack.Navigator>
      <MyPageStack.Screen
        name="auth-screen"
        component={Auth}
        options={{
          title: 'Մուտք գործել',
        }}
      />
      <MyPageStack.Screen
        name="reset-password"
        component={ResetPassword}
        options={{
          title: 'Վերականգնել գաղտնաբառը',
        }}
      />
    </MyPageStack.Navigator>
  );
};
