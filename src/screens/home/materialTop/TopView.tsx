import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useAuth } from "../../../context/AuthContext";
import Book from "../../../components/Book";
import axios from "axios";
import axiosPrivate from "../../../api/axiosPrivate";
import { useFocusEffect } from "@react-navigation/native";

export default function TopView({ navigation }: any) {
  const [dataSach, setDataSach] = useState([]);
  const [loading, setLoading] = React.useState(true);

  async function GetBook() {
    setLoading(true);

    try {
      const res = await axiosPrivate.get("book/get-top-views-book");
      setDataSach(res.data.data);
    } catch (e) {
      console.log("err", e);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      GetBook();
    }, [])
  );
  const renderItem = ({ item }: { item: any }) => (
    <Book
      category={item?.categoryId?.name}
      image={item?.image}
      titleBottom={item?.price.toString()}
      bookTitle={item?.title}
      authorName={item?.authorId?.name}
      type={item?.type}
      onPress={() => {
        navigation.navigate("BookDetails", { bookId: item._id });
      }}
    />
  );

  return (
    <LinearGradient colors={["#F3EAC1", "#E0F7F4"]} style={styles.container}>
      {loading ? (
        // Show loading spinner when data is being fetched
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={dataSach}
          renderItem={renderItem}
          keyExtractor={(item: any) => item._id}
          numColumns={3}
          contentContainerStyle={styles.list}
        />
      )}
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
});
