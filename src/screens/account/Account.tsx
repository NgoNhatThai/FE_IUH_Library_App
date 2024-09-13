import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useAuth } from "../../context/AuthContext";
const { width, height } = Dimensions.get("window");

export default function Account({ navigation }: any) {
  const { config, logout, user } = useAuth();
  return (
    <LinearGradient
      colors={["#F3EAC1", "#E0F7F4"]}
      style={{ flex: 1, alignItems: "center" }}
    >
      <View style={styles.ViewTop}>
        {user ? (
          <>
            <Image
              source={{
                uri: user?.studentCode.avatar,
              }}
              style={{ width: 110, height: 110, borderRadius: 100 }}
            />
            <TouchableOpacity
              onPress={() => {
                logout();
              }}
              style={{
                backgroundColor: "#E48641",
                paddingVertical: 8,
                paddingHorizontal: 18,
                borderRadius: 10,
                marginTop: 10,
              }}
            >
              <Text style={{ color: "white", fontSize: 18 }}>Đăng xuất</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Image
              source={{
                uri: "https://rubee.com.vn/wp-content/uploads/2021/05/Logo-IUH.jpg",
              }}
              style={{ width: 110, height: 110 }}
            />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SignIn");
              }}
              style={{
                backgroundColor: "#E48641",
                paddingVertical: 8,
                paddingHorizontal: 18,
                borderRadius: 10,
                marginTop: 10,
              }}
            >
              <Text style={{ color: "white", fontSize: 18 }}>
                Đăng nhập/Đăng kí
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  ViewTop: {
    width: width * 0.95,
    height: height * 0.25,
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});