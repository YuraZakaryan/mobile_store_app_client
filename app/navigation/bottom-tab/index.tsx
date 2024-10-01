import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Basket } from '../../components/screens';
import { useAppSelector } from '../../hooks/redux';
import { TIconName } from '../../types/navigation';
import { ICON_MAIN_COLOR } from '../../utils/constants';
import { HomePageStackGroup, ProductsPageStackGroup, SearchPageStackGroup } from '../stack-groups';
import { TopTabsGroup } from '../top-tab';
import { isAdmin } from './../../utils';
import { tabsName } from './../data';
import { ProfileStackGroup } from './../stack-groups/profile/main';
const Tab = createBottomTabNavigator();

export const TabGroup = () => {
  const { user, fetchMe } = useAppSelector((state) => state.user);
  const { basket } = useAppSelector((state) => state.order);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName: TIconName = 'home';
          if (route.name === tabsName.homeGroup) {
            iconName = 'home';
          } else if (route.name === tabsName.productsGroup) {
            iconName = 'appstore-o';
          } else if (route.name === tabsName.searchGroup) {
            iconName = 'search1';
          } else if (route.name === tabsName.basket) {
            iconName = 'retweet';
          }

          return route.name === tabsName.basket ? (
            <View className="relative">
              {basket.items.length > 0 ? (
                <View className="rounded-full bg-red-600 w-4 h-4 justify-center items-center z-50 absolute -right-1.5 -top-1">
                  <Text className="text-[10px]">{basket.items.length}</Text>
                </View>
              ) : null}
              <SimpleLineIcons name="basket" size={26} color={color} />
            </View>
          ) : (
            <AntDesign name={iconName} size={26} color={color} />
          );
        },
      })}>
      <Tab.Screen
        name={tabsName.homeGroup}
        component={HomePageStackGroup}
        options={{
          headerShown: false,
          tabBarLabel: 'Գլխավոր',
        }}
      />
      <Tab.Screen
        name={tabsName.productsGroup}
        component={ProductsPageStackGroup}
        options={{
          headerShown: false,
          title: 'Ապրանքներ',
        }}
      />
      <Tab.Screen
        name={tabsName.searchGroup}
        component={SearchPageStackGroup}
        options={{
          headerShown: false,
          title: 'Փնտրել',
        }}
      />
      <Tab.Screen
        name={tabsName.basket}
        component={Basket}
        options={{
          title: 'Զամբյուղ',
        }}
      />
      <Tab.Screen
        name={tabsName.profileGroup}
        component={user && isAdmin(user.role) ? TopTabsGroup : ProfileStackGroup}
        options={{
          headerShown: true,
          title: 'Իմ էջը',
          // tabBarLabel: ({ color }) => {
          //   if (fetchMe.isLoading) {
          //     return null;
          //   }

          //   return (
          //     <Text className="text-[10px] font-light" style={{ color }}>
          //       Իմ էջը
          //     </Text>
          //   );
          // },
          tabBarIcon: ({ color }) => {
            if (fetchMe.isLoading) {
              return <ActivityIndicator size="small" color={ICON_MAIN_COLOR} />;
            }
            const iconName: TIconName = 'user';

            return <AntDesign name={iconName} size={26} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};
