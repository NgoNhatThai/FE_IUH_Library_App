import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/Ionicons";

import GestureRecognizer from "react-native-swipe-gestures";
import axiosPrivate from "../../api/axiosPrivate";
import LinearGradient from "react-native-linear-gradient";
import { useAuth } from "../../context/AuthContext";
import TocPage from "../../components/TocPage";
import ChapterPage from "../../components/ChapterPage";
import Sound from "react-native-sound";

const { width } = Dimensions.get("window");

const BookReader = ({ route, navigation }: any) => {
  const { addHistory, history, user } = useAuth();
  const { bookId } = route.params;
  const [book, setBook] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [savedPage, setSavedPage] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const flatListRef = useRef<FlatList<any> | null>(null);
  const [showModalTop, setShowModalTop] = useState(false);
  const [showModalTopChapter, setShowModalTopChapter] = useState(false);
  const [chapter, setChapter] = useState(0);
  // tạo 1 biến lưu trữ thời gian khi vào trang này. Biến này sẽ được dùng để
  // khi người dùng thoát khỏi trang này thì gọi 1 api để cập nhật thời gian đọc sách ( tính bằng phút)
  const [timeReadStart, setTimeReadStart] = useState(new Date().getTime());
  // hàm thoát khỏi trang này
  const handleExitPage = async () => {
    if (route?.params?.bookId) {
      if (user) {
        const timeReadEnd = new Date().getTime();
        const readingDuration = Math.floor(
          (timeReadEnd - timeReadStart) / 60000
        ); // Tính thời gian đọc bằng phút
        console.log("Thời gian đọc sách:", readingDuration, "phút");

        if (readingDuration >= 1) {
          try {
            const res = await axiosPrivate.post("overview/update-read-time", {
              userId: user?.studentCode?._id,
              bookId: bookId,
              date: new Date().toISOString().split("T")[0],
              time: readingDuration,
            });
            console.log("Thời gian đọc đã được cập nhật", res.data);
          } catch (e) {
            console.log("Cập nhật thời gian đọc thất bại", e);
          }
        }
        navigation.navigate("BookDetails", { bookId: bookId });
      } else {
        navigation.navigate("BookDetails", { bookId: bookId });
      }
    } else {
      navigation.navigate("BookDetails", {
        dataDowload: route?.params?.dataDowload,
      });
    }
  };
  // các thuộc tính setting của chữ
  const [currentSizeIndex, setCurrentSizeIndex] = useState(2);
  const [textColor, setTextColor] = useState("black");
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [fontFamily, setFontFamily] = useState("sans-serif");
  const [readingDirection, setReadingDirection] = useState<
    "auto" | "ltr" | "rtl"
  >("ltr");
  // các thuộc tính liên quan đến voice
  const [isShowVoice, setIsShowVoice] = useState(false);
  const [isNextPage, setIsNextPage] = useState(false);
  // const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  // const [speechRate, setSpeechRate] = useState(0.5);

  // mảng chứa currentPage của từng chapter
  const [chapterPages, setChapterPages] = useState<number[]>([]);

  async function GetBook() {
    try {
      const res = await axiosPrivate.get(`book/get-detail-book/${bookId}`);
      setBook(res.data.data);
      // tính toán mảng của các chapter
      const chapterPages: number[] = [];
      let cumulativePage = 2; // Bắt đầu từ trang đầu tiên của chapter

      res.data.data.content.chapters.forEach((chapter: any) => {
        chapterPages.push(cumulativePage);
        cumulativePage += chapter?.images.length + 1;
      });
      setChapterPages(chapterPages);
      // Kiểm tra xem sách đã có trong lịch sử chưa
      if (user) {
        try {
          const res2 = await axiosPrivate.get(
            `user/get-user-book-mark?userId=${user?.studentCode?._id}&bookId=${res.data.data?._id}`
          );
          const chapterIndex = res.data.data.content.chapters.findIndex(
            (chapter: any) => chapter._id === res2.data.data?.lastReadChapterId
          );

          // Nếu tìm thấy chapter đã đọc gần nhất, thiết lập `savedPage`
          if (chapterIndex !== -1) {
            const page = chapterPages[chapterIndex] || 0;
            setSavedPage(page);
            setModalVisible(true);
          }
        } catch (err) {
          console.log("err", err);
        }
      } else {
        const bookInHistory = (history ?? []).find(
          (item: any) => item.bookId === bookId
        );
        console.log("bookInHistory", bookInHistory);
        // kiểm tra xem có phải là trang tiếp theo không
        if (route.params?.nextPage === undefined) {
          if (bookInHistory) {
            const lastReadChapterId = bookInHistory.lastReadChapterId;
            const chapterIndex = res.data.data.content.chapters.findIndex(
              (chapter: any) => chapter._id === lastReadChapterId
            );

            // Nếu tìm thấy chapter đã đọc gần nhất, thiết lập `savedPage`
            if (chapterIndex !== -1) {
              const page = chapterPages[chapterIndex] || 0;
              setSavedPage(page);
              setModalVisible(true);
            }
          }
        }
      }
    } catch (e) {
      console.log("err", e);
    }
  }
  const GetBookDowload = () => {
    setBook(route.params.dataDowload);
    // tính toán mảng của các chapter
    const chapterPages: number[] = [];
    let cumulativePage = 2; // Bắt đầu từ trang đầu tiên của chapter

    route.params.dataDowload.content.chapters.forEach((chapter: any) => {
      chapterPages.push(cumulativePage);
      cumulativePage += chapter?.images.length + 1;
    });
    setChapterPages(chapterPages);
  };
  const handleContinueReading = () => {
    setCurrentPage(savedPage); // Đọc từ trang đã lưu
    setModalVisible(false);
    // Cuộn đến trang đã lưu
    flatListRef.current?.scrollToIndex({ index: savedPage, animated: true });
  };

  const handleReadFromStart = () => {
    setCurrentPage(0); // Đọc từ trang đầu tiên
    setModalVisible(false);
  };

  useEffect(() => {
    if (route?.params?.bookId) {
      GetBook();
    } else {
      GetBookDowload();
    }
  }, [route?.params]);
  // thực hiện cuộn đến trang khi người dùng chọn chương
  useEffect(() => {
    if (chapter !== 0) {
      flatListRef.current?.scrollToIndex({ index: chapter, animated: true });
    }
  }, [chapter]);

  useEffect(() => {
    // const totalpage = book?.content.chapters.reduce(
    //   (acc: any, chapter: any) => acc + chapter.numberOfPage,
    //   0
    // );
    // if (book && currentPage !== 0) {
    //   const percentRead = Math.floor(((currentPage - 2) / totalpage) * 100);
    //   addHistory({
    //     bookId: bookId || route.params.dataDowload._id,
    //     image: book.image,
    //     title: book.title,
    //     currentPage: currentPage,
    //     percent: percentRead,
    //   });
    // }
    // kiểm tra xem trang hiện tại có thuộc index của chapter nào không.. nếu có thì call api updateUserBookMark
    const chapterIndex = chapterPages.findIndex((page) => currentPage == page);
    if (chapterIndex !== -1 && route?.params?.bookId) {
      if (user) {
        handleUpdateUserBookmark(book?.content.chapters[chapterIndex]._id);
      } else {
        const newHistory = {
          bookId: bookId,
          lastReadChapterId: book?.content.chapters[chapterIndex]._id,
          detail: {
            _id: bookId,
            title: book.title,
            authorId: {
              _id: book.authorId._id,
              name: book.authorId.name,
            },
            image: book.image,
          },
        };
        addHistory(newHistory);
      }
    }
  }, [currentPage]);
  // hàm cập nhật user bookmark khi chuyển chapter
  const handleUpdateUserBookmark = async (chapterId: number) => {
    try {
      await axiosPrivate
        .post("book/update-user-book-mark", {
          userId: user?.studentCode?._id,
          bookId: bookId,
          chapterId: chapterId,
        })
        .then((res) => {
          console.log("update bookmark success", res.data);
        });
    } catch (e) {
      console.log("update bookmark failed", e);
    }
  };
  useEffect(() => {
    if (route.params?.nextPage !== undefined) {
      setCurrentPage(route.params.nextPage);

      flatListRef.current?.scrollToIndex({
        index: route.params.nextPage,
        animated: true,
      });
      setIsNextPage(true);
    }
  }, [route.params?.nextPage]);
  console.log("currentPage", currentPage);

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

  const renderPage = ({ item, index }: any) => {
    if (index === 0) {
      return (
        <Image
          source={{ uri: book?.image }}
          style={{ width, height: "100%" }}
        />
      );
    } else if (index === 1) {
      return (
        <TocPage
          chapters={book?.content?.chapters}
          setCurrentPage={setCurrentPage}
          setChapter={setChapter}
        />
      );
    } else {
      let pageIndex = index - 2; // Giảm đi 2 vì trang đầu là bìa và trang thứ 2 là mục lục
      let chapterIndex = 0;

      // Tính toán vị trí trang trong chương
      while (pageIndex >= book.content.chapters[chapterIndex].text.length) {
        pageIndex -= book.content.chapters[chapterIndex].text.length;
        chapterIndex += 1;
      }

      if (pageIndex === 0) {
        return (
          // <TouchableWithoutFeedback
          //   onPress={() => setShowModalTopChapter(!showModalTopChapter)}
          // >
          //   <View style={{ width }}>
          //     <Text
          //       style={{
          //         fontSize: 24,
          //         fontWeight: "bold",
          //         marginTop: 70,
          //         textAlign: "center",
          //       }}
          //     >
          //       {book.content.chapters[chapterIndex].title}
          //     </Text>
          //     {showModalTopChapter && (
          //       <View style={[styles.modal, styles.modalTop]}>
          //         <TouchableOpacity
          //           style={{
          //             position: "absolute",
          //             left: 10,
          //             top: 10,
          //             padding: 10,
          //           }}
          //           onPress={() => {
          //             if (route?.params?.bookId) {
          //               navigation.navigate("BookDetails", { bookId: bookId });
          //             } else {
          //               navigation.navigate("BookDetails", {
          //                 dataDowload: route?.params?.dataDowload,
          //               });
          //             }
          //           }}
          //         >
          //           <Icon name="arrow-back" size={24} color="#fff" />
          //         </TouchableOpacity>
          //       </View>
          //     )}
          //   </View>
          // </TouchableWithoutFeedback>
          <View style={{ width }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                marginTop: 10,
                textAlign: "center",
              }}
            >
              {book.content.chapters[chapterIndex].title}
            </Text>
          </View>
        );
      } else {
        const textIndex = pageIndex - 1;

        return (
          <ChapterPage
            route={route?.params}
            currentPage={currentPage}
            pageIndex={index} // Truyền pageIndex vào ChapterPage
            id={bookId || route.params.dataDowload._id}
            chapter={book.content.chapters[chapterIndex]}
            chapters={book?.content?.chapters}
            textIndex={textIndex} // Sử dụng textIndex mới
            navigation={navigation}
            type={book.type}
            showModalTop={showModalTop}
            setShowModalTop={setShowModalTop}
            currentSizeIndex={currentSizeIndex}
            setCurrentSizeIndex={setCurrentSizeIndex}
            textColor={textColor}
            setTextColor={setTextColor}
            backgroundColor={backgroundColor}
            setBackgroundColor={setBackgroundColor}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            readingDirection={readingDirection}
            setReadingDirection={setReadingDirection}
            setCurrentPage={setCurrentPage}
            setChapter={setChapter}
            isShowVoice={isShowVoice}
            setIsShowVoice={setIsShowVoice}
            isNextPage={isNextPage}
            setIsNextPage={setIsNextPage}
            handleExitPage={handleExitPage}
            // selectedVoice={selectedVoice}
            // setSelectedVoice={setSelectedVoice}
            // speechRate={speechRate}
            // setSpeechRate={setSpeechRate}
            bookType={book.type}
          />
        );
      }
    }
  };

  return (
    <GestureRecognizer
      onSwipeLeft={() =>
        setCurrentPage((prev) =>
          Math.min(
            prev + 1,
            book.content.chapters.reduce(
              (acc: any, chapter: any) => acc + chapter.images.length + 1,
              2
            )
          )
        )
      }
      onSwipeRight={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
      style={{ flex: 1 }}
    >
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              width: width * 0.8,
              padding: 25,
              backgroundColor: "white",
              borderRadius: 10,
            }}
          >
            <Text
              style={{ fontSize: 20, marginBottom: 10, textAlign: "center" }}
            >
              Sách này bạn đã từng đọc, bạn có muốn tiếp tục đọc từ trang đã lưu
              không?
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity onPress={handleContinueReading}>
                <Text style={{ fontSize: 16, color: "blue" }}>Có</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleReadFromStart}>
                <Text style={{ fontSize: 16, color: "red" }}>Không</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        ref={flatListRef}
        data={[
          {},
          {},
          ...Array(
            book.content.chapters.reduce(
              (acc: any, chapter: any) => acc + chapter.images.length + 1,
              0
            )
          ),
        ]}
        initialScrollIndex={currentPage}
        renderItem={renderPage}
        keyExtractor={(_, index) => index?.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) =>
          setCurrentPage(Math.round(e.nativeEvent.contentOffset.x / width))
        }
        extraData={currentPage}
        getItemLayout={(_, index) => ({
          length: width, // Chiều rộng của mỗi trang
          offset: width * index, // Tính toán vị trí trang dựa trên chỉ số
          index,
        })}
        onScrollToIndexFailed={(info) => {
          // Xử lý trường hợp scrollToIndex thất bại
          flatListRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: true,
          });
        }}
      />
    </GestureRecognizer>
  );
};

export default BookReader;
const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderColor: "black",
    borderWidth: 1,
    zIndex: 1000,
  },
  modalTop: {
    top: 0,
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 20,
  },
});
