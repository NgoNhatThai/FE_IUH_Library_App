import React, { useCallback } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import axiosPrivate from "../../../api/axiosPrivate";
import { useAuth } from "../../../context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import BookHorizontal from "../../../components/BookHorizontal";

const { width, height } = Dimensions.get("window");

export default function Following({ navigation }: any) {
  const { user } = useAuth();
  const [data, setData] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get(
        `user/get-follow-list?userId=${user?.studentCode._id}&pageIndex=0&pageSize=10`
      );
      setData(response?.data?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderItem = ({ item }: any) => {
    return (
      <BookHorizontal
        category={item?.category}
        image={item?.image}
        titleBottom={item?.price.toString()}
        bookTitle={item?.title}
        authorName={item?.author}
        onPress={() => {
          navigation.navigate("BookDetails", { bookId: item._id });
        }}
      />
    );
  };

  return (
    <LinearGradient
      colors={["#F3EAC1", "#E0F7F4"]}
      style={{ flex: 1, alignItems: "center" }}
    >
      {loading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : data.length > 0 ? (
        <View
          style={{
            width: width,
            height: height * 0.06,
            padding: 11,
            backgroundColor: "#fff",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "black" }}>
            0 sách
          </Text>
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 16, color: "black" }}>Xóa tất cả</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // <FlatList
        //   data={data}
        //   renderItem={renderItem}
        //   refreshControl={
        //     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        //   }
        // />
        <View
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "black", fontSize: 17 }}>
            Bạn chưa có thông báo nào
          </Text>
        </View>
      )}
    </LinearGradient>
  );
}
