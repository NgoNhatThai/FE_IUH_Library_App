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

export default function CatergoryDetail({ route, navigation }: any) {
  const { item } = route.params;
  const [dataSach, setDataSach] = useState([]);

  async function GetBook() {
    try {
      const res = await axiosPrivate.get(
        `book/get-book-by-category/${item._id}`
      );
      setDataSach(res.data.data);
    } catch (e) {
      console.log("err", e);
    }
  }

  useEffect(() => {
    GetBook();
  }, []);

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
      type={item?.type}
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
          THỂ LOẠI: {item?.name}
        </Text>
      </View>
      <View
        style={{ width: "100%", height: 1, backgroundColor: "black" }}
      ></View>
      <View
        style={{
          marginTop: 10,
          width: "92%",
          height: 100,
          backgroundColor: "#fff",
          borderRadius: 10,
          padding: 10,
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: "black",
            textAlign: "justify",
          }}
        >
          {item?.desc}
        </Text>
      </View>
      <FlatList
        data={dataSach}
        renderItem={renderItem}
        keyExtractor={(item: any) => item._id}
        numColumns={3}
        contentContainerStyle={styles.list}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {},
  goBackButton: {
    borderRadius: 20,
  },
});
