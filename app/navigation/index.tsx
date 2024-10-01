import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { getOrderByUserInProgressThunk } from '../redux/http/orderThunk';
import { fetchMe } from '../redux/http/userThunk';
import { TabGroup } from './bottom-tab';
import { tabsName } from './data';
import { AuthPageStackGroup } from './stack-groups';

const Navigation = () => {
  const dispatch = useAppDispatch();

  const { user, isAuth, fetchMe: Me } = useAppSelector((state) => state.user);

  useEffect((): void => {
    dispatch(fetchMe());
  }, []);

  useEffect(() => {
    dispatch(getOrderByUserInProgressThunk(user?._id as string));
  }, [user]);

  const Stack = createNativeStackNavigator();

  return (
    !Me.isLoading && (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAuth ? (
            <Stack.Screen name="MainTabs" component={TabGroup} />
          ) : (
            <Stack.Screen name={tabsName.authorizationGroup} component={AuthPageStackGroup} />
          )}
        </Stack.Navigator>
        <Toast />
      </NavigationContainer>
    )
  );
};

export default Navigation;
