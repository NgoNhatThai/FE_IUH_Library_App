import React, { useCallback, useState } from "react";
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
  Modal,
} from "react-native";
import axiosPrivate from "../../../api/axiosPrivate";
import { useAuth } from "../../../context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import RNFS from "react-native-fs";
import LinearGradient from "react-native-linear-gradient";
import BookHorizontal from "../../../components/BookHorizontal";
import { formatFileSize } from "../../../constants/funcition";
const { width, height } = Dimensions.get("window");

export default function Dowload({ navigation }: any) {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [books, setBooks] = useState<any[]>([]);
  const [modalVisibleDeleteALl, setModalVisibleDeleteALl] = useState(false);
  const fetchDownloadedBooks = async () => {
    setLoading(true);
    try {
      const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
      const bookFiles = files.filter(
        (file) => file.name.startsWith("book_") && file.name.endsWith(".json")
      );

      const booksData = await Promise.all(
        bookFiles.map(async (file) => {
          const content = await RNFS.readFile(file.path, "utf8");
          const parsedContent = JSON.parse(content);

          return {
            ...parsedContent,
            fileSize: formatFileSize(file.size), // Format dung lượng file
          };
        })
      );
      setBooks(booksData);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sách đã tải:", error);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchDownloadedBooks();
    }, [])
  );
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDownloadedBooks();
    setRefreshing(false);
  };

  const renderDeleteAllModal = () => (
    <Modal
      transparent={true}
      visible={modalVisibleDeleteALl}
      onRequestClose={() => setModalVisibleDeleteALl(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            Bạn có chắc chắn muốn xóa tất cả sách đã theo dõi?
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                setModalVisibleDeleteALl(false);
                // HandleDeleteAll();
              }}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Đồng ý</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisibleDeleteALl(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
  const renderItem = ({ item }: any) => {
    return (
      <BookHorizontal
        category={item?.categoryId?.name}
        image={item?.image}
        titleBottom={item?.price.toString()}
        bookTitle={item?.title}
        authorName={item?.authorId?.name}
        onPress={() => {
          navigation.navigate("BookDetails", { bookId: item._id });
        }}
        // onPressCategory={() => {
        //   navigation.navigate("CatergoryDetail", { item: item?.categoryId });
        // }}
        isDowload={true}
        fileSize={item.fileSize}
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
      ) : books.length > 0 ? (
        <>
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
              {books.length} sách
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisibleDeleteALl(true)}
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 16, color: "black" }}>Xóa tất cả</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={books}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </>
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
            Bạn chưa theo dõi sách nào
          </Text>
        </View>
      )}
      {renderDeleteAllModal()}
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  loginButton: {
    backgroundColor: "#ff3333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
  },
});
