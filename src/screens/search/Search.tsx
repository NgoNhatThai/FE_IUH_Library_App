import React, { useEffect, useState } from "react";
import {
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
import { useDebounce } from "use-debounce";
import axiosPrivate from "../../api/axiosPrivate";
import BookHorizontal from "../../components/BookHorizontal";
import { useAuth } from "../../context/AuthContext";
const { width, height } = Dimensions.get("window");

const data = [
  {
    id: 1,
    title: "Sách 1",
  },
  {
    id: 2,
    title: "Sách thiếu nhi",
  },
  {
    id: 3,
    title: "Sách kinh tế",
  },
  {
    id: 4,
    title: "Sách văn học",
  },
  {
    id: 5,
    title: "Sách kỹ năsdasdasdasdasdng",
  },
  {
    id: 6,
    title: "Sác năng",
  },
  {
    id: 7,
    title: "Sác aaaaa",
  },
  {
    id: 8,
    title: "Sác năng",
  },
  {
    id: 9,
    title: "Sách thiếu nhi",
  },
  {
    id: 10,
    title: "Sách kinh tế",
  },
  {
    id: 11,
    title: "Sách văn học",
  },
  {
    id: 12,
    title: "Sách kỹ năsdasdasdasdasdng",
  },
  {
    id: 13,
    title: "Sác năng",
  },
  {
    id: 14,
    title: "Sách kỹ năsdasdasdasdasdng",
  },
  {
    id: 15,
    title: "Sác năng",
  },
  {
    id: 16,
    title: "Sác aaaaa",
  },
  {
    id: 17,
    title: "Sác năng",
  },
  {
    id: 18,
    title: "Sách thiếu nhi",
  },
  {
    id: 19,
    title: "Sách kinh tế",
  },
  {
    id: 20,
    title: "Sách văn học",
  },
  {
    id: 21,
    title: "Sách kỹ năsdasdasdasdasdng",
  },
];
export default function Search({ navigation }: any) {
  const { keySearch, addKeySearch } = useAuth();
  console.log("keySearch", keySearch);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText] = useDebounce(searchText, 700);
  const [books, setBooks] = useState([]);
  const handleClear = () => {
    setSearchText("");
  };
  // const handleSearch = () => {
  //   axiosPrivate
  //     .get(`/book/find-books-by-text-input?${searchText}`, {})
  //     .then((response) => {
  //       console.log("object", response.data);
  //       setBooks(response.data.data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };
  // // console.log("books", books);
  // useEffect(() => {
  //   if (debouncedSearchText) {
  //     handleSearch();
  //   }
  // }, [debouncedSearchText]);
  const [dataSach, setDataSach] = useState([]);

  async function GetBook() {
    try {
      const res = await axiosPrivate.get("book/get-top-views-book");
      setDataSach(res.data.data);
    } catch (e) {
      console.log("err", e);
    }
  }
  const handleSearch = async (text: string) => {
    addKeySearch({ key: text });
    try {
      const res = await axiosPrivate.get(
        `book/find-books-by-text-input?text=${text}`
      );
      console.log("object", res.data.data);
      // setDataSach(res?.data?.data);
    } catch (e) {
      console.log("err", e);
    }
  };
  useEffect(() => {
    GetBook();
  }, []);
  const renderItem = ({ item }: { item: any }) => (
    <BookHorizontal
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
  const renderItemKey = (item: any) => {
    return (
      <TouchableOpacity
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
      <View style={styles.bottomContainer}>
        {/* <FlatList
          data={dataSach}
          renderItem={renderItem}
          keyExtractor={(item: any) => item._id}
          contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
        /> */}
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
            contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
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
          data={data}
          renderItem={({ item }) => renderItemKey(item.title)}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
        />
      </View>
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
});
