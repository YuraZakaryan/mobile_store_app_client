import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  NavigationContainer,
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import {
  Basket,
  CategoriesControl,
  CategoryCreateEdit,
  Home,
  LastOrders,
  OrdersControl,
  OrderView,
  ProductCreateEdit,
  ProductPage,
  Products,
  ProductsControl,
  ProductsPageByCategory,
  Profile,
  Search,
  UserCreateEdit,
  UserPasswordEdit,
  UsersControl,
  OrderCompletedView,
  OrdersCompleted,
  AboutApp,
  ResetPassword,
} from './components/screens';
import { Auth } from './components/screens/auth';
import { Loading } from './components/ui';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { getOrderByUserInProgressThunk } from './redux/http/orderThunk';
import { fetchMe } from './redux/http/userThunk';
import { TIconName, TTabsName } from './types/navigation';
import { isAdmin } from './utils';
import { ICON_MAIN_COLOR } from './utils/constants';

const tabsName: TTabsName = {
  homeGroup: 'home group',
  productsGroup: 'products group',
  searchGroup: 'search group',
  basket: 'basket',
  profileGroup: 'profile group',
  authorizationGroup: 'auth group',
};

// Stack

const MyPageStack = createNativeStackNavigator();

const OrderViewPageStackGroup = () => {
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

const OrdersCompletedPageStackGroup = () => {
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

const ProfileStackGroup = () => {
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
    </MyPageStack.Navigator>
  );
};

const HomePageStackGroup = () => {
  return (
    <MyPageStack.Navigator>
      <MyPageStack.Screen
        name="home"
        component={Home}
        options={{
          title: 'Գլխավոր',
        }}
      />
      <MyPageStack.Screen
        name="about-app"
        component={AboutApp}
        options={{
          title: 'Ծրագրի մասին',
        }}
      />
      <MyPageStack.Screen
        name="product"
        component={ProductPage}
        options={{
          title: 'Ապրանք',
        }}
      />

      <MyPageStack.Screen
        name="byFilter"
        component={ProductsPageByCategory}
        options={{
          presentation: 'modal',
          title: 'Ըստ կատեգորիայի',
        }}
      />
    </MyPageStack.Navigator>
  );
};
const ProductsPageStackGroup = () => {
  return (
    <MyPageStack.Navigator>
      <MyPageStack.Screen
        name="Ապրանքներ"
        component={Products}
        options={{
          title: 'Ապրանքներ',
        }}
      />
      <MyPageStack.Screen
        name="product"
        component={ProductPage}
        options={{
          title: 'Ապրանք',
        }}
      />
    </MyPageStack.Navigator>
  );
};

export const SearchPageStackGroup = () => {
  return (
    <MyPageStack.Navigator>
      <MyPageStack.Screen
        name="Փնտրել"
        component={Search}
        options={{
          title: 'Փնտրել',
        }}
      />
      <MyPageStack.Screen
        name="product"
        component={ProductPage}
        options={{
          title: 'Ապրանք',
        }}
      />
    </MyPageStack.Navigator>
  );
};

const AuthPageStackGroup = () => {
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

const UsersControlPageStackGroup = () => {
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

const CategoriesControlPageStackGroup = () => {
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

const ProductsControlPageStackGroup = () => {
  return (
    <MyPageStack.Navigator>
      <MyPageStack.Screen
        name="products-control"
        component={ProductsControl}
        options={{
          headerShown: false,
        }}
      />
      <MyPageStack.Screen
        name="productCreateEdit"
        component={ProductCreateEdit}
        options={{
          title: 'Փոփոխել ապրանքը',
          presentation: 'modal',
          headerTitleStyle: { fontSize: 14 },
        }}
      />
    </MyPageStack.Navigator>
  );
};

// Tab top

const TopTabs = createMaterialTopTabNavigator();
const TopTabsGroup = () => {
  return (
    <TopTabs.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarLabelStyle: {
          textTransform: 'capitalize',
          fontWeight: 'bold',
          flexDirection: 'row',
        },
      }}>
      <TopTabs.Screen
        name="profileTop"
        component={ProfileStackGroup}
        options={{
          title: 'Գլխավոր',
        }}
      />
      <TopTabs.Screen
        name="productsGroup"
        component={ProductsControlPageStackGroup}
        options={{
          title: 'Ապրանքներ',
        }}
      />
      <TopTabs.Screen
        name="categoriesGroup"
        component={CategoriesControlPageStackGroup}
        options={{
          title: 'Կատեգորիաներ',
        }}
      />

      <TopTabs.Screen
        name="usersGroup"
        component={UsersControlPageStackGroup}
        options={{
          title: 'Հաճախորդներ',
        }}
      />
    </TopTabs.Navigator>
  );
};
// Tab bottom
const Tab = createBottomTabNavigator();

const TabGroup = () => {
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
          tabBarLabel: ({ color }) => {
            if (fetchMe.isLoading) {
              return null;
            }

            return (
              <Text className="text-[10px] font-light" style={{ color }}>
                Իմ էջը
              </Text>
            );
          },
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

const Navigation = () => {
  const dispatch = useAppDispatch();

  const { user, isAuth, fetchMe: Me } = useAppSelector((state) => state.user);

  React.useEffect((): void => {
    dispatch(fetchMe());
  }, []);

  React.useEffect(() => {
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
