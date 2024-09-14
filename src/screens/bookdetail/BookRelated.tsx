import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import axiosPrivate from "../../api/axiosPrivate";
import BookHorizontal from "../../components/BookHorizontal";
import { useAuth } from "../../context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");

type dataHotSearch = {
  _id: string;
  keyword: string;
  searchCount: number;
  isTrending: boolean;
  relatedBookIds: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};
export default function BookRelated({ navigation, route }: any) {
  const [loading, setLoading] = useState(false);

  const [dataSach, setDataSach] = useState([]);

  const getBookRelated = async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get(
        `book/get-related-books/${route.params.book._id}`
      );
      setDataSach(res?.data?.data);
    } catch (e) {
      console.log("err", e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getBookRelated();
    }, [route.params.book._id])
  );
  const renderItem = ({ item }: { item: any }) => (
    <View style={{ flex: 1 }}>
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
    </View>
  );

  return (
    <LinearGradient
      colors={["#F3EAC1", "#E0F7F4"]}
      style={{ flex: 1, alignItems: "center" }}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#DD8A4A" />
        </View>
      ) : (
        <FlatList
          data={dataSach}
          renderItem={renderItem}
          horizontal={false}
          keyExtractor={(item: any) => item._id}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    height: height * 0.07,
    position: "relative",
  },
  input: {
    flex: 1,
    fontSize: 18,
    marginLeft: 10,
    color: "#333",
  },
  icon: {
    marginLeft: 10,
  },
  bottomContainer: {
    height: height * 0.42,
    width: "100%",
    padding: 10,
    alignItems: "flex-start",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
