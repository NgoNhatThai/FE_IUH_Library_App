import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl, // Import RefreshControl
} from "react-native";
import axiosPrivate from "../../../api/axiosPrivate";
import { useAuth } from "../../../context/AuthContext";
const { width, height } = Dimensions.get("window");

export default function AllNotify({ navigation }: any) {
  const { user } = useAuth();
  const [data, setData] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false); // Refreshing state

  const fetchData = async () => {
    try {
      const response = await axiosPrivate.get(
        `user/get-notification?userId=${user?.studentCode._id}`
      );
      setData(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

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
          height: 130,
          backgroundColor: item?.status == "READ" ? "#fff" : "#F2F6FC",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
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
              uri: item?.bookId?.image,
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
            gap: 10,
          }}
        >
          <Text style={{ fontSize: 19, fontWeight: "bold", color: "black" }}>
            {item?.bookId?.title}
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
    <View style={{ flex: 1, alignItems: "center" }}>
      {data.length > 0 ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          // keyExtractor={(item) => item.id.toString()}
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