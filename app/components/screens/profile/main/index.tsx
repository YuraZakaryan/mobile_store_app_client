import React from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { AccountEditButton, LastOrderButton, UserAvatar, UserName } from './ui';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { logOut } from '../../../../redux/reducers/user/userSlice';
import { accountEditLabels, isAdmin } from '../../../../utils';

export const Profile = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const handleLogOut = () => {
    dispatch(logOut());
  };

  return (
    <SafeAreaView>
      <ScrollView
        style={{
          height: '100%',
        }}>
        <View className="flex-1 gap-8 py-3 h-full">
          <View className="p-5">
            <View className="border border-gray-400 py-5 w-full flex-1 justify-center items-center rounded">
              <UserAvatar />
              <UserName />
            </View>
          </View>
          <View>
            {user && isAdmin(user.role) ? (
              <View>
                <LastOrderButton label="Պատվերներ" navigateTo="allOrders" />
                <LastOrderButton
                  label="Պատվերների պամություն"
                  navigateTo="ordersCompleted"
                  className="mt-5"
                />
              </View>
            ) : (
              <LastOrderButton label="Վերջին պատվերներ" navigateTo="lastOrders" />
            )}
            <View className="mt-7">
              <AccountEditButton
                label={accountEditLabels.editAccount}
                navigateTo="userCreateEdit"
                item={user}
              />
              <AccountEditButton
                label={accountEditLabels.editPassword}
                navigateTo="userPasswordEdit"
                className="mt-4"
                item={user}
              />
            </View>
          </View>
          {user && !isAdmin(user.role) ? (
            <View className="flex-1 justify-center items-center">
              <Image
                source={require('./../../../../assets/images/products_my_page.png')}
                className="w-60 h-60"
              />
            </View>
          ) : null}
          <TouchableOpacity
            className="justify-center items-center bg-orange-400 p-3"
            onPress={handleLogOut}>
            <Text className="text-lg font-bold text-white">Ելք</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
