import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import axiosPrivate from "../../api/axiosPrivate";
import { useAuth } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastError, ToastSuscess } from "../../utils/function";
import BookDetail_Comment from "./BookDetail_Comment";
import BookRelated from "./BookRelated";
import RNFS from "react-native-fs";
import { formatFileSize } from "../../constants/funcition";
const { width, height } = Dimensions.get("window");

const Tab = createMaterialTopTabNavigator();

type BookDetailsProps = {
  route: {
    params: {
      bookId: string;
    };
  };
};

type Book = {
  _id: string;
  title: string;
  authorId: any;
  categoryId: any;
  image: string;
  review: any;
  desc: string;
  content: any;
  price: number;
};

const BookDetails = ({ route, navigation }: any) => {
  const { user, token } = useAuth();
  const { bookId } = route.params;
  const [book, setBook] = useState<Book | null>(null);
  const [isFolow, setIsFolow] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isBuy, setIsBuy] = useState(false);
  const [modalBuyBook, setModalBuyBook] = useState(false);
  async function CheckBuy() {
    try {
      if (!user) {
        console.log("User is null");
        return;
      }
      const res = await axiosPrivate.get(
        `user/get-user-book-mark?userId=${user.studentCode._id}&bookId=${bookId}`
      );

      if (res.data?.data?.isBuy) {
        setIsBuy(true);
      }
    } catch (e) {
      console.log("err", e);
    }
  }
  async function GetBook() {
    try {
      const res = await axiosPrivate.get(`book/get-detail-book/${bookId}`);
      setBook(res.data.data);
    } catch (e) {
      console.log("err", e);
    }
  }
  async function GetBookDowload() {
    setBook(route.params.dataDowload);
  }

  async function CheckFolow(id: string) {
    try {
      const res = await axiosPrivate.get(
        `user/check-follow-book?userId=${id}&bookId=${bookId}`
      );
      if (res.data == true) {
        setIsFolow(true);
      } else {
        setIsFolow(false);
      }
    } catch (e) {
      console.log("err", e);
    }
  }
  const Folow = async () => {
    if (!route?.params?.bookId) {
      return;
    }
    if (!user) {
      setModalVisible(true);
      return;
    } else {
      if (!isFolow) {
        try {
          const res = await axiosPrivate.post("user/follow", {
            bookId: bookId,
            userId: user.studentCode._id,
          });
          ToastSuscess({ text1: "Đã theo dõi sách" });

          await CheckFolow(user.studentCode._id);
          return;
        } catch (e) {
          console.log("err", e);
        }
      }
      if (isFolow) {
        try {
          const res = await axiosPrivate.get(
            `user/un-follow?userId=${user.studentCode._id}&bookId=${bookId}`
          );
          // setIsFolow(true);
          ToastError({ text1: "Đã bỏ theo dõi sách" });

          await CheckFolow(user.studentCode._id);
          return;
        } catch (e) {
          console.log("err", e);
        }
      }
    }
  };
  const [isDowload, setIsDowload] = useState(false);
  const [booksDowload, setBooksDowload] = useState<any[]>([]);
  const fetchDownloadedBooks = async () => {
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
            fileSize: formatFileSize(file.size),
          };
        })
      );
      if (route.params.bookId) {
        if (booksData.some((b) => b._id === route.params.bookId)) {
          setIsDowload(true);
        }
      } else {
        if (booksData.some((b) => b._id === route.params.dataDowload?._id)) {
          setIsDowload(true);
        }
      }
      setBooksDowload(booksData);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sách đã tải:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (route?.params?.bookId) {
        GetBook();
        fetchDownloadedBooks();
        CheckBuy();
        if (user) {
          CheckFolow(user.studentCode._id);
        }
      } else {
        GetBookDowload();
        fetchDownloadedBooks();
      }
    }, [route.params])
  );
  // useEffect(() => {
  //   GetBook();
  // }, [bookId]);
  if (!book) {
    return (
      <LinearGradient
        colors={["#F3EAC1", "#E0F7F4"]}
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <ActivityIndicator size="large" />
      </LinearGradient>
    );
  }

  const renderLoginModal = () => (
    <Modal
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Bạn cần đăng nhập</Text>
          <Text style={styles.modalText}>
            Để tiếp tục thao tác này, vui lòng đăng nhập.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("SignIn");
              }}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
  const renderBuyBookModal = () => (
    <Modal
      transparent={true}
      visible={modalBuyBook}
      onRequestClose={() => setModalBuyBook(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Xác nhận mua sách</Text>
          <Text style={styles.modalText}>
            Xác nhận mua {book?.title} với giá là {book?.price}đ ?
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => setModalBuyBook(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                try {
                  if (!user) {
                    setModalVisible(true);
                    return;
                  }
                  const res = await axiosPrivate.post("user/buy-book", {
                    userId: user.studentCode._id,
                    bookId: bookId,
                  });
                  if (res.data.status === 400) {
                    ToastError({
                      text2: "Số dư không đủ!",
                    });
                    setModalBuyBook(false);

                    return;
                  }
                  CheckBuy();
                  GetBook();
                  setModalBuyBook(false);
                  ToastSuscess({ text1: "Mua sách thành công!" });
                } catch (e) {
                  console.log("err", e);
                }
              }}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const DowLoad = async () => {
    try {
      // kiểm tra xem đã tải sách chưa
      if (booksDowload.some((b) => b._id === book._id)) {
        Alert.alert("Sách đã được tải xuống", "Hãy vào kệ sách để xem.");
        return;
      }
      // kiểm tra tổng dung lượng sách đã tải để cảnh báo
      const totalSize = booksDowload
        .map((b) => parseInt(b.fileSize.slice(0, 3)))
        .reduce((a, b) => a + b, 0);
      if (totalSize >= 10 * 1024) {
        Alert.alert(
          "Dung lượng sách đã tải vượt quá 100MB",
          "Hãy xóa bớt sách đã tải để tải thêm."
        );
        return;
      }
      const bookData = JSON.stringify(book);
      const fileName = `book_${book._id}.json`;
      const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      setIsDownloading(true);
      setDownloadProgress(0);
      await RNFS.writeFile(path, bookData, "utf8");
      setDownloadProgress(1);

      Alert.alert(
        "Tải sách thành công!",
        `Sách "${book.title}" đã được tải xuống.`
      );
      await fetchDownloadedBooks();
    } catch (error: any) {
      Alert.alert("Lỗi khi tải sách", error.message);
    } finally {
      setIsDownloading(false);
    }
  };
  // hàm đọc sách
  const handelReadBook = async () => {
    if (route?.params?.bookId) {
      if (user) {
        try {
          // kiểm tra xem đã đọc chưa, nếu chưa thì thêm vào danh sách đọc
          const res = await axiosPrivate.get(
            `user/get-user-book-mark?userId=${user?.studentCode?._id}&bookId=${bookId}`
          );
          console.log("res", res.data?.data?.readChapterIds);
          if (res.data?.data?.readChapterIds?.length > 0) {
            navigation.navigate("BookReader", { bookId: bookId });
          } else {
            const res = await axiosPrivate.post(`user/read`, {
              userId: user?.studentCode?._id,
              bookId: bookId,
              chapterId: book?.content?.chapters[0]?._id,
            });
            navigation.navigate("BookReader", { bookId: bookId });
          }
        } catch (e) {
          console.log("err", e);
        }
      } else {
        navigation.navigate("BookReader", { bookId: bookId });
      }
    } else {
      navigation.navigate("BookReader", { dataDowload: book });
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={28} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ position: "absolute", top: 20, right: 30, zIndex: 1 }}
        onPress={DowLoad}
      >
        {!isDowload ? (
          <Ionicons name="cloud-download-outline" size={28} color="black" />
        ) : (
          <Ionicons name="cloud-download" size={28} color="black" />
        )}
      </TouchableOpacity>
      {isDownloading && (
        <Modal transparent={true} visible={isDownloading}>
          <View style={styles.progressModal}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Đang tải xuống: {(downloadProgress * 100).toFixed(0)}%</Text>
          </View>
        </Modal>
      )}
      <View style={styles.topContainer}>
        <Image
          source={{ uri: book.image }}
          style={styles.backgroundImage}
          blurRadius={10}
        />
        <View style={styles.overlay}>
          <Image source={{ uri: book.image }} style={styles.bookImage} />
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>{book.authorId?.name}</Text>
            <TouchableOpacity style={styles.categoryButton}>
              <Text style={styles.categoryText}>{book?.categoryId?.name}</Text>
            </TouchableOpacity>

            {/* <Text style={styles.statText}>❤️ {book?.review?.totalLike}</Text> */}
            <Text style={styles.statText}>
              ⭐ {book?.review?.rate.toFixed(1)}
            </Text>
            <Text style={styles.statText}>👁️ {book?.review?.totalView}</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <Tab.Navigator
          screenOptions={() => ({
            tabBarActiveTintColor: "#E48641",
            tabBarInactiveTintColor: "#000000",
            tabBarLabelStyle: { fontSize: 12, fontWeight: "bold" },
            tabBarItemStyle: { width: 100 },
            tabBarIndicatorStyle: { backgroundColor: "#E48641" },
            tabBarStyle: {
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            tabBarBackground: () => (
              <LinearGradient
                colors={["#E0F7F4", "#CDE7E4"]}
                style={{ flex: 1 }}
              />
            ),
            headerBackground: () => (
              <LinearGradient
                colors={["#F3EAC1", "#E0F7F4"]}
                style={{ flex: 1 }}
              />
            ),
          })}
        >
          <Tab.Screen name="Giới thiệu">
            {() => (
              <ScrollView style={styles.container}>
                <Text selectable={true} style={styles.Text}>
                  {book.desc}
                </Text>
              </ScrollView>
            )}
          </Tab.Screen>
          {route?.params?.bookId && (
            <>
              <Tab.Screen name="Bình luận">
                {() => (
                  <BookDetail_Comment
                    bookId={bookId}
                    navigation={navigation}
                    route={route}
                  />
                )}
              </Tab.Screen>
              <Tab.Screen name="Sách liên quan">
                {() => (
                  <BookRelated
                    bookId={bookId}
                    navigation={navigation}
                    route={route}
                  />
                )}
              </Tab.Screen>
            </>
          )}
          {/* <Tab.Screen name="Sách giấy">
            {() => (
              <ScrollView style={styles.container}>
                <Text style={styles.Text}>Sách giấy</Text>
              </ScrollView>
            )}
          </Tab.Screen> */}
        </Tab.Navigator>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity onPress={Folow} style={styles.heartButton}>
          {/* <Icon name="heart" size={28} color="#f00" /> */}
          <Text style={{ fontSize: 18, color: "black" }}>
            {isFolow ? "Bỏ theo dõi" : "Theo dõi"}
          </Text>
        </TouchableOpacity>
        {book.price > 0 && !isBuy ? (
          <TouchableOpacity
            onPress={() => {
              if (!user) {
                setModalVisible(true);
                return;
              } else {
                setModalBuyBook(true);
              }
            }}
            style={styles.readButton}
          >
            <Text style={styles.readButtonText}>Mua Sách</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handelReadBook} style={styles.readButton}>
            <Text style={styles.readButtonText}>Đọc Sách</Text>
          </TouchableOpacity>
        )}
      </View>
      {renderLoginModal()}
      {renderBuyBookModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  goBackButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1,
    padding: 10,
    borderRadius: 20,
  },
  topContainer: {
    height: height * 0.3,
    position: "relative",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
  },
  overlay: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  bookImage: {
    width: 140,
    height: 200,
    resizeMode: "contain",
  },
  infoContainer: {
    marginLeft: 20,
    flex: 1,
    gap: 7,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  author: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 4,
  },
  categoryButton: {
    backgroundColor: "#f07b3f",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  categoryText: {
    fontSize: 16,
    color: "#fff",
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  statText: {
    fontSize: 16,
    color: "#fff",
    marginRight: 20,
  },
  bottomContainer: {
    flex: 1,
    height: height * 0.5,
    backgroundColor: "#fff",
  },
  actionContainer: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  heartButton: {
    width: width * 0.23,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
  },
  readButton: {
    width: width * 0.67,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: "#f07b3f",
    marginLeft: 10,
  },
  readButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  Text: {
    fontSize: 20,
    color: "#333",
    marginBottom: 4,
    textAlign: "justify",
  },
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
    backgroundColor: "#f07b3f",
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
  progressModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default BookDetails;
