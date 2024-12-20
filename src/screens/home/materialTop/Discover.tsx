import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  LogBox,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Swiper from "react-native-swiper";
import { useAuth } from "../../../context/AuthContext";
import BookRecently from "../../../components/BookRecently";
import AntDesign from "react-native-vector-icons/AntDesign";
import axiosPrivate from "../../../api/axiosPrivate";
import Book from "../../../components/Book";
import { useFocusEffect } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function Discover({ navigation }: any) {
  const { config, history, user, token } = useAuth();
  const [dataBookSuggest, setDataBookSuggest] = useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingRecently, setLoadingRecently] = React.useState(true);
  const [dataBookRecently, setDataBookRecently] = useState(history);
  async function GetBookSuggest() {
    setLoading(true);
    try {
      const res = await axiosPrivate.get(
        `book/get-recommend-books?userId=${user?.studentCode?._id}`
      );
      if (res?.data?.data?.message) {
        setDataBookSuggest([]);
        return;
      }
      setDataBookSuggest(res.data.data);
    } catch (e) {
      console.log("erre", e);
    } finally {
      setLoading(false);
    }
  }
  const getBookRecently = async () => {
    if (user) {
      setLoadingRecently(true);
      try {
        const res = await axiosPrivate.get(
          `user/get-user-read-history?userId=${user?.studentCode?._id}`
        );

        setDataBookRecently(res.data.data);
      } catch (e) {
        console.log("erre", e);
      } finally {
        setLoadingRecently(false);
      }
    } else {
      setDataBookRecently(history);
      setLoadingRecently(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getBookRecently();

      if (user) {
        GetBookSuggest();
      } else {
        setDataBookSuggest([]);
        setLoading(false);
        setLoadingRecently(false);
      }
      LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
      LogBox.ignoreLogs([
        "`flexWrap: `wrap`` is not supported with the `VirtualizedList` components",
      ]);
    }, [user, history])
  );
  const renderBookRecently = ({ item }: any) => (
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

  const renderSuggest = ({ item }: { item: any }) => (
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
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.swiperContainer}>
          {config && (
            <Swiper autoplay autoplayTimeout={2} loop showsPagination>
              {config?.banners?.map((item: any, index: number) => (
                <View style={styles.slide} key={index}>
                  <Image source={{ uri: item }} style={styles.image} />
                </View>
              ))}
            </Swiper>
          )}
          <Text style={{ fontWeight: "600", fontSize: 17 }}>
            <Text style={{ color: "red" }}>E-BOOK</Text> VÀ KHÔNG GIAN VĂN HÓA
            HỒ CHÍ MINH
          </Text>
        </View>

        <View style={styles.swiperBackgroundContainer}>
          <Image
            source={{
              uri: "https://www.sachweb.com/images/quote-1920x500.jpg",
            }}
            style={styles.backgroundImage}
          />
          <View style={styles.textSwiperContainer}>
            <Swiper autoplay autoplayTimeout={2} loop showsPagination>
              <View style={styles.textSlide}>
                <Text style={styles.textContent}>
                  “Biết bao kẻ đọc sách và học hỏi, không phải để tìm ra chân lý
                  mà là để gia tăng những gì mình đã biết." (Junline Green)
                </Text>
              </View>
              <View style={styles.textSlide}>
                <Text style={styles.textContent}>
                  “Gặp được một quyển sách hay nên mua liền dù đọc được hay
                  không đọc được, vì sớm muộn gì cũng cần đến nó." (W.
                  Churchill)
                </Text>
              </View>
              <View style={styles.textSlide}>
                <Text style={styles.textContent}>
                  “Cần phải yêu mến và tin vào sách. Cần rèn luyện cho mình thói
                  quen thực hành và kỹ năng dùng sách để làm việc." (N. Rubakin)
                </Text>
              </View>
            </Swiper>
          </View>
        </View>

        <View style={styles.recentlyHeader}>
          <Text style={{ fontWeight: "600", fontSize: 20, color: "black" }}>
            Gần đây
          </Text>
          <AntDesign
            name="right"
            size={20}
            color="black"
            onPress={() => navigation.navigate("RecentlyDetail")}
          />
        </View>
        {dataBookRecently?.length > 0 ? (
          <FlatList
            data={dataBookRecently}
            renderItem={renderBookRecently}
            keyExtractor={(item: any) => item?.bookId?.toString()}
            horizontal
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <Text style={{ textAlign: "center", fontSize: 20, color: "black" }}>
            Bạn chưa đọc sách nào gần đây
          </Text>
        )}

        <View style={styles.recentlyHeader}>
          <Text style={{ fontWeight: "600", fontSize: 20, color: "black" }}>
            Gợi ý cho bạn
          </Text>
          <AntDesign
            name="right"
            size={20}
            color="black"
            onPress={() =>
              navigation.navigate("SuggestDetail", { dataBookSuggest })
            }
          />
        </View>
        {loading ? (
          <ActivityIndicator
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 200,
            }}
            size="large"
            color="#0000ff"
          />
        ) : dataBookSuggest?.length > 0 ? (
          <FlatList
            data={dataBookSuggest?.slice(0, 6)}
            renderItem={renderSuggest}
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

        {/* <View style={{ flex: 1, alignItems: "center", marginVertical: 7 }}>
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "70%",
              height: 55,
              backgroundColor: "white",
              borderRadius: 50,
            }}
          >
            <Text
              style={{ textAlign: "center", color: "blue", fontWeight: "bold" }}
            >
              Xem thêm
            </Text>
          </TouchableOpacity>
        </View> */}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  swiperContainer: {
    height: height * 0.24,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    marginTop: 10,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width,
    height: "100%",
    resizeMode: "cover",
  },
  swiperBackgroundContainer: {
    height: height * 0.24,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginTop: 10,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  textSwiperContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  textSlide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  textContent: {
    fontSize: 17,
    color: "#fff",
    textAlign: "center",
  },
  recentlyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  listContainer: {
    paddingHorizontal: 0,
    height: height * 0.13,
  },
});
