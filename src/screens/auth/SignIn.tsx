import React, { Component, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ToastError, ToastSuscess } from "../../utils/function";
import axiosPrivate from "../../api/axiosPrivate";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
export default function SignIn({ navigation }: any) {
  const [mssv, setMssv] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  async function handleSignIn() {
    try {
      if (!mssv || !password) {
        ToastError({
          text1: "Lỗi",
          text2: "Vui lòng nhập đầy đủ thông tin",
        });
        return;
      }
      // const res = await axios.post("http://192.168.1.21:8084/auth/verify", {
      //   studentCode: mssv,
      //   // password: password,
      // });
      // const config = await axios.get(
      //   "http://192.168.1.21:8084/admin/get-config/66c494eba011ad39b8b63880"
      // );
      const res = await axiosPrivate.post("auth/verify", {
        studentCode: mssv,
        // password: password,
      });

      login({
        userData: { studentCode: res.data.data.userRaw },
        token: res.data.data.access_token,
      });
      navigation.navigate("Home");
    } catch (e) {
      ToastError({
        text1: "Lỗi",
        text2: "Mssv hoặc mật khẩu không đúng",
      });
      console.log("err", e);
    }
  }
  return (
    <View style={{ width: "100%", height: "100%" }}>
      <ImageBackground
        source={require("../../assets/img/BackgoundLogin.png")}
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.2)", "rgba(0, 0, 0, 1)"]}
          style={{ width: "100%", height: "100%" }}
        ></LinearGradient>
      </ImageBackground>
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.4)", "rgba(0, 0, 0, 1.7)"]}
        style={styles.overlay}
      >
        <Text style={{ color: "white", fontSize: 26, fontWeight: 400 }}>
          Chào mừng bạn đến với
        </Text>
        <Text style={{ color: "white", fontSize: 35, fontWeight: 600 }}>
          IUH_Library
        </Text>
        <View
          style={{
            width: "90%",
            alignItems: "center",
            justifyContent: "center",
            gap: 15,
            marginTop: 30,
          }}
        >
          <Text
            style={{
              color: "#747474",
              fontSize: 20,
              textAlign: "center",
            }}
          >
            Đăng nhập để đồng bộ dữ liệu của tài khoản trên nhiều thiết bị
          </Text>
          <TextInput
            value={mssv}
            onChangeText={setMssv}
            style={styles.input}
            placeholder="Mssv"
            placeholderTextColor="#747474"
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholder="Mật khẩu"
            placeholderTextColor="#747474"
            secureTextEntry={true}
          />
          <TouchableOpacity
            onPress={handleSignIn}
            style={{
              marginTop: 10,
              width: "95%",
              height: 50,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#0FBF8E",
              borderRadius: 35,
            }}
          >
            <Text style={{ color: "#6CE4C0", fontSize: 24 }}>ĐĂNG NHẬP</Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "95%",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SignUp");
              }}
            >
              <Text style={{ color: "#1EAB85", fontSize: 18 }}>
                Đăng kí ngay
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={{ color: "#1EAB85", fontSize: 18 }}>
                Quên mật khẩu
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
const styles = StyleSheet.create({
  backgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    position: "absolute",
    top: 0,
    left: 0,
  },
  overlay: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "95%",
    height: 45,
    backgroundColor: "#2C2C2E",
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 20,
    color: "#fff",
  },
});
