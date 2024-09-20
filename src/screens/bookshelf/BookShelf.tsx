import React from "react";
import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import LinearGradient from "react-native-linear-gradient"; // Import LinearGradient
const Tab = createMaterialTopTabNavigator();
import { Following, Dowload } from "../index";

export default function BookShelf({ navigation }: any) {
  return (
    <LinearGradient
      colors={["#F3EAC1", "#E0F7F4"]} // Gradient cho cả nền
      style={{ flex: 1 }}
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "#E48641",
          tabBarInactiveTintColor: "#000000",
          tabBarLabelStyle: { fontSize: 12, fontWeight: "bold" },
          tabBarItemStyle: { width: 120 },
          tabBarIndicatorStyle: { backgroundColor: "#E48641" },
          tabBarStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            backgroundColor: "transparent", // Đặt màu nền của tab bar trong suốt
          },
          headerBackground: () => (
            <LinearGradient
              colors={["#F3EAC1", "#E0F7F4"]} // Gradient cho header
              style={{ flex: 1 }}
            />
          ),
        })}
      >
        <Tab.Screen name="Đang theo dõi" component={Following} />
        <Tab.Screen name="Tải xuống" component={Dowload} />
        {/* <Tab.Screen name="Danh mục" component={Category} /> */}
      </Tab.Navigator>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({});
