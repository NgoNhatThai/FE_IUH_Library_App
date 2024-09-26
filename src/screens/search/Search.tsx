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
export default function Search({ navigation }: any) {
  const { keySearch, addKeySearch } = useAuth();
  const [searchText, setSearchText] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading
  const handleClear = () => {
    setSearchText("");
    handleSearch("");
    setIsSearch(false);
  };
  const [dataSach, setDataSach] = useState([]);

  const handleSearch = async (text: string) => {
    addKeySearch({ key: text });
    setDataSach([]);
    if (text == "") {
      setDataSach([]);
      setIsSearch(false);
      return;
    }
    setIsSearch(true);
    setLoading(true);
    try {
      const res = await axiosPrivate.get(
        `book/find-books-by-text-input?text=${text}`
      );
      setDataSach(res?.data?.data);
    } catch (e) {
      console.log("err", e);
    } finally {
      setLoading(false);
    }
  };
  const [dataHotSearch, setDataHotSearch] = useState<dataHotSearch[]>([]);
  const getHotSearch = async () => {
    try {
      const res = await axiosPrivate.get(`user/get-hot-search`);
      setDataHotSearch(res?.data?.data);
    } catch (e) {
      console.log("err", e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getHotSearch();
    }, [keySearch])
  );
  const renderItem = ({ item }: { item: any }) => (
    <BookHorizontal
      category={item?.categoryId[0]?.name}
      image={item?.image}
      titleBottom={item?.price.toString()}
      bookTitle={item?.title}
      authorName={item?.authorId[0]?.name}
      onPress={() => {
        navigation.navigate("BookDetails", { bookId: item._id });
      }}
      onPressCategory={() => {
        navigation.navigate("CatergoryDetail", { item: item?.categoryId });
      }}
      star={item?.review[0]?.rate}
    />
  );
  const renderItemKey = (item: any) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSearchText(item);
          handleSearch(item);
        }}
        style={{
          padding: 7,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: "#DD8A4A",
          borderRadius: 10,
          backgroundColor: "#fff",
          margin: 5,
        }}
      >
        <Text style={{ fontSize: 16 }}>{item}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <LinearGradient
      colors={["#F3EAC1", "#E0F7F4"]}
      style={{ flex: 1, alignItems: "center" }}
    >
      <View style={styles.searchBar}>
        <Icon name="search" size={24} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nhập tên sách, tên tác giả..."
          value={searchText}
          onChangeText={setSearchText}
          onBlur={() => {
            handleSearch(searchText);
          }}
        />
        {searchText ? (
          <TouchableOpacity onPress={handleClear}>
            <Icon name="times" size={24} color="#999" style={styles.icon} />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity>
          <Icon name="microphone" size={24} color="#999" style={styles.icon} />
        </TouchableOpacity>
      </View>
      {dataSach.length > 0 ? (
        <View
          style={{
            height: height * 0.82,
            width: "100%",
            padding: 10,
            alignItems: "flex-start",
          }}
        >
          {/* FlatList hiện sách nếu có dữ liệu */}
          <FlatList
            data={dataSach}
            renderItem={renderItem}
            keyExtractor={(item: any) => item._id}
            contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
          />
        </View>
      ) : !isSearch ? (
        <>
          <View style={styles.bottomContainer}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 3,
                color: "#333",
              }}
            >
              Từ khóa gần đây
            </Text>
            {keySearch.length > 0 ? (
              <FlatList
                data={keySearch}
                renderItem={({ item }) => renderItemKey(item.key)}
                contentContainerStyle={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
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
                  Bạn chưa có tìm kiếm gần đây
                </Text>
              </View>
            )}
          </View>
          <View style={styles.bottomContainer}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#333",
                marginBottom: 3,
              }}
            >
              Từ khóa nổi bật
            </Text>
            <FlatList
              data={dataHotSearch}
              renderItem={({ item }) => renderItemKey(item.keyword)}
              keyExtractor={(item) => item._id.toString()}
              contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
            />
          </View>
        </>
      ) : loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#DD8A4A" />
          <Text>Đang tìm kiếm...</Text>
        </View>
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontSize: 19, fontWeight: 600 }}>
            Không tìm thấy sách
          </Text>
        </View>
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
