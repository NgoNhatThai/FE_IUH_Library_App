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
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useAuth } from "../../context/AuthContext";
const { width, height } = Dimensions.get("window");

export default function Wallet({ navigation }: any) {
  const { config, logout, user } = useAuth();
  return (
    <LinearGradient colors={["#F3EAC1", "#E0F7F4"]} style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          height: 50,
          alignItems: "center",
          padding: 10,
          gap: 15,
        }}
      >
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={26} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "black" }}>
          Tiền trong ví
        </Text>
      </View>
      <View
        style={{ width: "100%", height: 1, backgroundColor: "black" }}
      ></View>
      <View
        style={{
          marginTop: 10,
          width: "92%",
          height: 160,
          backgroundColor: "#fff",
          borderRadius: 10,
          padding: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
            gap: 10,
          }}
        >
          {/* // màu đậm hơn nữa: #E48641 */}
          <FontAwesome name="bitcoin" size={40} color="#E48641" />
          <Text style={{ fontSize: 28, color: "black", fontWeight: "bold" }}>
            0
          </Text>
        </View>
        <Text style={{ fontSize: 20, color: "gray" }}>Dùng để mua sách</Text>
        <TouchableOpacity
          style={{
            width: "90%",
            height: 50,
            backgroundColor: "#E48641",
            borderRadius: 40,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
          onPress={() => {
            navigation.navigate("Deposit");
          }}
        >
          <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
            Nạp tiền
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  list: {},
  goBackButton: {
    borderRadius: 20,
  },
});
