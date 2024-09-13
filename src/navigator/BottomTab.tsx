import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Home, BookShelf, Search, Account, Notify } from "../screens/index";
import Icon from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();
export default function BottomTab() {
  return (
    <Tab.Navigator
      initialRouteName="TrangChu"
      screenOptions={{
        tabBarActiveTintColor: "#E3872D",
        tabBarInactiveTintColor: "#000000",

        tabBarLabelStyle: {
          fontSize: 15,
          fontWeight: "bold",
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Trang chủ "
        component={Home}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name="home"
              size={27}
              color={focused ? "#E3872D" : "#000000"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Kệ sách"
        component={BookShelf}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name="bookshelf"
              size={27}
              color={focused ? "#E3872D" : "#000000"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Tìm kiếm"
        component={Search}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name="search1"
              size={27}
              color={focused ? "#E3872D" : "#000000"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Thông báo"
        component={Notify}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name="notifications-outline"
              size={27}
              color={focused ? "#E3872D" : "#000000"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Tài khoản"
        component={Account}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name="user"
              size={27}
              color={focused ? "#E3872D" : "#000000"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
