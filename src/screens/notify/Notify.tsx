import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { AllNotify, UnRead } from "../index";

const Tab = createMaterialTopTabNavigator();

export default function Notify({ navigation }: any) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#E48641",
        tabBarInactiveTintColor: "#000000",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          textAlign: "center",
        },
        tabBarItemStyle: {
          width: 120,
          justifyContent: "center",
        },
        tabBarIndicatorStyle: {
          backgroundColor: "#E48641",
          height: 3,
          width: 110,
          marginLeft: "auto",
          marginRight: "auto",
        },
        tabBarStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
          alignSelf: "center",
          width: 250,
          backgroundColor: "transparent",
        },
        tabBarBackground: () => (
          <LinearGradient colors={["#E0F7F4", "#CDE7E4"]} style={{ flex: 1 }} />
        ),
      })}
    >
      <Tab.Screen name="Tất cả" component={AllNotify} />
      <Tab.Screen name="Chưa đọc" component={UnRead} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
