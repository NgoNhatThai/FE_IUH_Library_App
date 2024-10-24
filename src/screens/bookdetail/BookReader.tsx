import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import axiosPrivate from "../../api/axiosPrivate";
import LinearGradient from "react-native-linear-gradient";
import { useAuth } from "../../context/AuthContext";
import TocPage from "../../components/TocPage";
import ChapterPage from "../../components/ChapterPage";
import Sound from "react-native-sound";

const { width } = Dimensions.get("window");

const BookReader = ({ route, navigation }: any) => {
  const { addHistory, history } = useAuth();
  const { bookId } = route.params;
  const [book, setBook] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [savedPage, setSavedPage] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const flatListRef = useRef<FlatList<any> | null>(null);
  const [showModalTop, setShowModalTop] = useState(false);
  const [chapter, setChapter] = useState(0);

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

  async function GetBook() {
    try {
      const res = await axiosPrivate.get(`book/get-detail-book/${bookId}`);
      setBook(res.data.data);

      // Kiểm tra xem sách đã có trong lịch sử chưa
      // const bookInHistory = history.find((item: any) => item.bookId === bookId);
      const bookInHistory = (history ?? []).find(
        (item: any) => item.bookId === bookId
      );
      console.log("bookInHistory", bookInHistory);
      // kiểm tra xem có phải là trang tiếp theo không
      if (route.params?.nextPage === undefined) {
        if (bookInHistory) {
          setSavedPage(bookInHistory.currentPage); // Lưu trang đã lưu trong state
          setModalVisible(true); // Hiển thị modal hỏi người dùng
        } else {
          setCurrentPage(0); // Nếu không có trong lịch sử, bắt đầu từ trang đầu
        }
      }
    } catch (e) {
      console.log("err", e);
    }
  }
  const GetBookDowload = () => {
    setBook(route.params.dataDowload);
  };
  const handleContinueReading = () => {
    setCurrentPage(savedPage); // Đọc từ trang đã lưu
    setModalVisible(false); // Đóng modal
    // Cuộn đến trang đã lưu
    flatListRef.current?.scrollToIndex({ index: savedPage, animated: true });
  };

  const handleReadFromStart = () => {
    setCurrentPage(0); // Đọc từ trang đầu tiên
    setModalVisible(false); // Đóng modal
  };

  useEffect(() => {
    if (route?.params?.bookId) {
      GetBook();
    } else {
      GetBookDowload();
    }
  }, [route?.params]);
  useEffect(() => {
    if (chapter !== 0) {
      flatListRef.current?.scrollToIndex({ index: chapter, animated: true });
    }
  }, [chapter]);

  useEffect(() => {
    // Dừng âm thanh khi currentPage thay đổi

    const totalpage = book?.content.chapters.reduce(
      (acc: any, chapter: any) => acc + chapter.numberOfPage,
      0
    );
    if (book && currentPage !== 0) {
      const percentRead = Math.floor(((currentPage - 2) / totalpage) * 100);

      addHistory({
        bookId: bookId || route.params.dataDowload._id,
        image: book.image,
        title: book.title,
        currentPage: currentPage,
        percent: percentRead,
      });
    }
  }, [currentPage]);
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
          <View style={{ width }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", padding: 10 }}>
              {book.content.chapters[chapterIndex].title}
            </Text>
          </View>
        );
      } else {
        const textIndex = pageIndex - 1;

        return (
          <ChapterPage
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
            // selectedVoice={selectedVoice}
            // setSelectedVoice={setSelectedVoice}
            // speechRate={speechRate}
            // setSpeechRate={setSpeechRate}
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
