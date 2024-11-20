import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useAuth } from "../../context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import axiosPrivate from "../../api/axiosPrivate";
const { width, height } = Dimensions.get("window");
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function Account({ navigation }: any) {
  const { config, logout, user } = useAuth();
  const [anmount, setAnmount] = React.useState({});
  const [loading, setLoading] = React.useState(false); // Loading state

  const getAmount = async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get(
        `user/get-user-amount?userId=${user?.studentCode._id}`
      );
      setAnmount(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      if (user) {
        getAmount();
      }
    }, [])
  );
  // hàm format tiền
  const formatCash = (cash: number) => {
    return cash?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const Gach = () => (
    <View
      style={{
        width: "100%",
        height: 1,
        backgroundColor: "#D3D3D3",
      }}
    ></View>
  );
  return (
    <LinearGradient
      colors={["#F3EAC1", "#E0F7F4"]}
      style={{ flex: 1, alignItems: "center" }}
    >
      {loading ? (
        // Show loading spinner when data is being fetched
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          <View style={styles.ViewTop}>
            {user ? (
              <>
                <Image
                  source={{
                    uri: user?.studentCode.avatar,
                  }}
                  style={{ width: 110, height: 110, borderRadius: 100 }}
                />
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginTop: 10,
                    color: "black",
                  }}
                >
                  {user?.studentCode.userName}
                </Text>

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
                  <Text style={{ color: "white", fontSize: 18 }}>
                    Đăng xuất
                  </Text>
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
          {user && (
            <View style={[styles.ViewDetail, { marginTop: 5 }]}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Wallet");
                }}
                style={{
                  flexDirection: "row",
                  width: "90%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <MaterialIcons
                  name="attach-money"
                  size={30}
                  color={"#E48641"}
                />
                <Text style={{ fontSize: 20, color: "black", width: "85%" }}>
                  Tiền của tôi:{" "}
                  <Text style={{ fontSize: 18, color: "black" }}>
                    {formatCash(anmount?.total)}{" "}
                    {anmount?.total > 0 ? (
                      <Text style={{ fontSize: 18, color: "gray" }}>đ</Text>
                    ) : (
                      <Text style={{ fontSize: 18, color: "gray" }}>0 đ</Text>
                    )}
                  </Text>
                </Text>

                <MaterialIcons
                  name="navigate-next"
                  size={30}
                  color={"#E48641"}
                />
              </TouchableOpacity>
              <Gach />
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("History");
                }}
                style={{
                  flexDirection: "row",
                  width: "90%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <MaterialIcons name="history" size={30} color={"#E48641"} />
                <Text style={{ fontSize: 20, color: "black", width: "85%" }}>
                  Lịch sử hoạt động
                </Text>
                <MaterialIcons
                  name="navigate-next"
                  size={30}
                  color={"#E48641"}
                />
              </TouchableOpacity>
              <Gach />
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("PersonalStatistics");
                }}
                style={{
                  flexDirection: "row",
                  width: "90%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <MaterialIcons name="history" size={30} color={"#E48641"} />
                <Text style={{ fontSize: 20, color: "black", width: "85%" }}>
                  Thống kê cá nhân
                </Text>
                <MaterialIcons
                  name="navigate-next"
                  size={30}
                  color={"#E48641"}
                />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
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
  ViewDetail: {
    paddingVertical: 10,
    width: width * 0.95,
    height: height * 0.2,
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
