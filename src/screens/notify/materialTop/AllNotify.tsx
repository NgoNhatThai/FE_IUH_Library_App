import React, { useCallback } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator, // Import ActivityIndicator for loading spinner
  RefreshControl,
} from "react-native";
import axiosPrivate from "../../../api/axiosPrivate";
import { useAuth } from "../../../context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function AllNotify({ navigation }: any) {
  const { user } = useAuth();
  const [data, setData] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true); // Loading state

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get(
        `user/get-notification?userId=${user?.studentCode._id}`
      );
      setData(response?.data?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Stop loading after data is fetched
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );
  const onRefresh = async () => {
    setRefreshing(true); // Start refreshing
    await fetchData(); // Reload data
    setRefreshing(false); // Stop refreshing
  };

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={{
          width: width * 0.96,
          height: 170,
          backgroundColor: item?.status == "READ" ? "#fff" : "#E0F7F4",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          marginBottom: 10,
        }}
        onPress={async () => {
          try {
            const res = await axiosPrivate.post(
              `user/update-notification-status`,
              {
                userId: user?.studentCode._id,
                notifyId: item._id,
              }
            );
            console.log("res", res?.data);
            navigation.navigate("BookDetails", { bookId: item.bookId._id });
          } catch (err) {
            console.log(err);
          }
        }}
      >
        <View
          style={{
            width: "30%",
            alignItems: "center",
            justifyContent: "center",
            height: 130,
          }}
        >
          <Image
            source={{
              uri: item?.bookId?.image
                ? item?.bookId?.image
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmH5sA70dBQJKIuuv1teh1OG5eQZLzS4QZDg&s",
            }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 100,
              resizeMode: "cover",
            }}
          />
        </View>
        <View
          style={{
            width: "70%",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 7,
          }}
        >
          <Text style={{ fontSize: 19, fontWeight: "bold", color: "black" }}>
            {item?.bookId?.title ? item?.bookId?.title : "Hệ thống"}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {item?.message}
          </Text>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>
            {item?.createdAt.slice(0, 10)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 10,
      }}
    >
      {loading ? (
        // Show loading spinner when data is being fetched
        <ActivityIndicator size="large" color="#0000ff" />
      ) : data?.length > 0 ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
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
    </View>
  );
}
