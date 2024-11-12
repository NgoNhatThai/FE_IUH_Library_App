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

export default function SuggestDetail({ route, navigation }: any) {
  const { dataBookSuggest } = route.params;
  const { config, history, user, token } = useAuth();

  const [dataSachSuggestDetail, setDataSachSuggestDetail] = useState<any>([]);
  const GetBookSuggestDetail = () => {
    setDataSachSuggestDetail(dataBookSuggest);
  };
  useEffect(() => {
    GetBookSuggestDetail();
  }, []);
  //   async function GetBookSuggestDetail() {
  //     try {
  //       const res = await axiosPrivate.get(
  //         `book/get-book-by-category/${item._id}`
  //       );
  //       setDataSachSuggestDetail(res.data.data);
  //     } catch (e) {
  //       console.log("err", e);
  //     }
  //   }

  //   useEffect(() => {
  //     GetBookSuggestDetail();
  //   }, []);

  const renderItem = ({ item }: { item: any }) => (
    <Book
      category={item?.categoryId?.name}
      image={item?.image}
      titleBottom={item?.price.toString()}
      bookTitle={item?.title}
      authorName={item?.authorId?.name}
      onPress={() => {
        navigation.navigate("BookDetails", { bookId: item._id });
      }}
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
          Gợi ý cho bạn
        </Text>
      </View>
      <View
        style={{ width: "100%", height: 1, backgroundColor: "black" }}
      ></View>

      {dataBookSuggest?.length > 0 ? (
        <FlatList
          data={dataBookSuggest}
          renderItem={renderItem}
          keyExtractor={(item: any) => item._id}
          numColumns={3}
          // contentContainerStyle={styles.list}
        />
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 20, color: "black" }}>
            Chưa có gợi ý sách nào cho bạn
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
