import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import AuthNavigator from "./AuthNavigator";
import HomeNavigator from "./HomeNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, useColorScheme } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import Toast from "react-native-toast-message";
import { ToastConfig } from "../config/ToastConfig";

const RootNavigator = () => {
  const { user } = useAuth();
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  return (
    <NavigationContainer>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={backgroundStyle.backgroundColor}
        />
      </SafeAreaView>
      <HomeNavigator />
      {/* {user ? <HomeNavigator /> : <AuthNavigator />} */}
      <Toast config={ToastConfig} />
    </NavigationContainer>
  );
};

export default RootNavigator;
