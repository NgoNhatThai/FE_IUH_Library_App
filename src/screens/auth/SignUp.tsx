import React, { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ToastError, ToastSuscess } from "../../utils/function";
import axios from "axios";
import axiosPrivate from "../../api/axiosPrivate";
function SignUp({ navigation }: any) {
  const [mssv, setMssv] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [userName, setUserName] = useState("");
  async function handleSignUp() {
    try {
      if (!userName || !mssv || !password || !password2) {
        ToastSuscess({
          text1: "Vui lòng nhập đầy đủ thông tin",
          text2: "Vui lòng kiểm tra lại",
        });
        return;
      }
      if (password !== password2) {
        ToastSuscess({
          text1: "Mật khẩu không trùng khớp",
          text2: "Vui lòng kiểm tra lại",
        });

        return;
      }
      const res = await axiosPrivate.post("auth/register", {
        userName: userName,
        studentCode: mssv,
        password: password,
      });
      console.log("res", res);
      ToastSuscess({
        text1: "Đăng kí thành công ",
        text2: "Hãy đăng nhập để trải nghiệm !!!",
      });
      navigation.navigate("SignIn");
    } catch (e) {
      ToastError({
        text1: "Lỗi",
        text2: "Mssv đã tồn tại",
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
            value={userName}
            onChangeText={setUserName}
            style={styles.input}
            placeholder="Tên đăng nhập"
            placeholderTextColor="#747474"
          />
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
          <TextInput
            value={password2}
            onChangeText={setPassword2}
            style={styles.input}
            placeholder="Nhập lại mật khẩu"
            placeholderTextColor="#747474"
            secureTextEntry={true}
          />
          <TouchableOpacity
            onPress={handleSignUp}
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
            <Text style={{ color: "#6CE4C0", fontSize: 24 }}>TIẾP TỤC</Text>
          </TouchableOpacity>
          {/* <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "95%",
            }}
          >
            <TouchableOpacity>
              <Text style={{ color: "#1EAB85", fontSize: 18 }}>
                Đăng kí ngay
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={{ color: "#1EAB85", fontSize: 18 }}>
                Quên mật khẩu
              </Text>
            </TouchableOpacity>
          </View> */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignIn");
            }}
          >
            <Text style={{ color: "#1EAB85", fontSize: 19 }}>
              Đã có tài khoản ?
            </Text>
          </TouchableOpacity>
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
export default SignUp;
