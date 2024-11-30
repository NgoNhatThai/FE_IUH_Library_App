import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import axios from "axios";
import axiosPrivate from "../../api/axiosPrivate";
import Book from "../../components/Book";
import Icon from "react-native-vector-icons/Ionicons";
import BookRecently from "../../components/BookRecently";
import { useAuth } from "../../context/AuthContext";

export default function RecentlyDetail({ route, navigation }: any) {
  //   const { item } = route.params;
  const { config, history, user, token } = useAuth();

  const [dataSachRecentlyDetail, setDataSachRecentlyDetail] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const GetBookRecentlyDetail = async () => {
    if (user) {
      setLoading(true);
      try {
        const res = await axiosPrivate.get(
          `user/get-user-read-history?userId=${user?.studentCode?._id}`
        );
        console.log("res", res.data.data);
        setDataSachRecentlyDetail(res.data.data);
      } catch (e) {
        console.log("erre", e);
      } finally {
        setLoading(false);
      }
    } else {
      setDataSachRecentlyDetail(history);
      setLoading(false);
    }
  };
  useEffect(() => {
    GetBookRecentlyDetail();
  }, [user]);
  //   async function GetBookRecentlyDetail() {
  //     try {
  //       const res = await axiosPrivate.get(
  //         `book/get-book-by-category/${item._id}`
  //       );
  //       setDataSachRecentlyDetail(res.data.data);
  //     } catch (e) {
  //       console.log("err", e);
  //     }
  //   }

  //   useEffect(() => {
  //     GetBookRecentlyDetail();
  //   }, []);

  const renderItem = ({ item }: { item: any }) => (
    <BookRecently
      bookID={item.bookId}
      // percent={item.percent}
      title={item.detail?.title}
      image={item.detail?.image}
      author={item.detail?.authorId?.name}
      onPress={() =>
        navigation.navigate("BookDetails", { bookId: item.bookId })
      }
    />
  );

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
          Lịch sử đọc gần đây
        </Text>
      </View>
      <View
        style={{ width: "100%", height: 1, backgroundColor: "black" }}
      ></View>

      {dataSachRecentlyDetail?.length > 0 ? (
        <View>
          <FlatList
            data={dataSachRecentlyDetail}
            renderItem={renderItem}
            keyExtractor={(item: any) => item.bookId.toString()}
            contentContainerStyle={styles.listContainer}
            numColumns={2}
          />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 20, color: "black" }}>
            Chưa có sách nào trong lịch sử đọc gần đây
          </Text>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {},
  goBackButton: {
    borderRadius: 20,
  },
  listContainer: {
    paddingHorizontal: 0,
  },
});
