import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
const { width, height } = Dimensions.get("window");
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import TocPage from "./TocPage";
import Slider from "@react-native-community/slider";
import Tts, { Voice } from "react-native-tts";

const ChapterPage = ({
  id,
  route,
  chapter,
  textIndex,
  // biến lưu tổng mảng chương
  chapters,
  navigation,
  type,
  currentPage,
  showModalTop,
  setShowModalTop,
  handleMucLuc,
  handleSearch,
  handleBookMark,
  currentSizeIndex,
  setCurrentSizeIndex,
  textColor,
  setTextColor,
  backgroundColor,
  setBackgroundColor,
  fontFamily,
  setFontFamily,
  readingDirection,
  setReadingDirection,
  setCurrentPage,
  setChapter,
  setIsShowVoice,
  isShowVoice,
  pageIndex,
  isNextPage,
  setIsNextPage,
  handleExitPage,
  bookType,
}: // selectedVoice,
// setSelectedVoice,
// speechRate,
// setSpeechRate,
any) => {
  const sizes = [
    { fontSize: 10, lineHeight: 30, padding: 20 },
    { fontSize: 12, lineHeight: 26, padding: 19 },
    { fontSize: 14, lineHeight: 23, padding: 17 },
    { fontSize: 16, lineHeight: 21, padding: 13 },
    { fontSize: 18, lineHeight: 19, padding: 10 },
  ];
  // State cho cỡ chữ, màu chữ, màu nền, phông chữ, và hướng đọc
  const [isModalVisibleSetting, setModalVisibleSetting] = useState(false);
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const [isBackgroundColorPickerVisible, setIsBackgroundColorPickerVisible] =
    useState(false);
  const [isFontPickerVisible, setIsFontPickerVisible] = useState(false);
  const [isModalMucLucVisible, setModalMucLucVisible] = useState(false);
  const colorOptions = ["black", "red", "blue", "white", "orange"];
  const fontOptions = [
    "sans-serif",
    "cursive",
    "AfacadFlux-Black",
    "OpenDyslexic3-Bold",
  ];

  const handleFontSizeChange = (action: string) => {
    if (action === "minus" && currentSizeIndex < sizes.length - 1) {
      setCurrentSizeIndex(currentSizeIndex + 1);
    } else if (action === "plus" && currentSizeIndex > 0) {
      setCurrentSizeIndex(currentSizeIndex - 1);
    } else if (action === "reset") {
      setCurrentSizeIndex(2);
    }
  };
  const [currentChunk, setCurrentChunk] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [isModalSettingVoice, setModalSettingVoice] = useState(false);
  const [isVoiceModalVisible, setIsVoiceModalVisible] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState(0.5);
  const [pitch, setPitch] = useState(1.0); // Cao độ mặc định là 1.0
  useEffect(() => {
    Tts.voices().then((voices) => {
      const availableVoices = voices.filter(
        (voice) => !voice.networkConnectionRequired && !voice.notInstalled
      );
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[5].id);
      }
    });
  }, []);
  useEffect(() => {
    Tts.setDefaultRate(speechRate);
    if (isShowVoice && !isPaused) {
      Tts.stop();
      speakText(currentChunk); // Phát lại đoạn văn bản hiện tại với tốc độ mới
    }
  }, [speechRate]);
  useEffect(() => {
    if (selectedVoice) {
      Tts.setDefaultVoice(selectedVoice);
      if (isShowVoice && !isPaused) {
        Tts.stop();
        speakText(currentChunk); // Phát lại đoạn văn bản hiện tại với giọng đọc mới
      }
    }
  }, [selectedVoice]);

  useEffect(() => {
    Tts.setDefaultPitch(pitch); // Thiết lập cao độ giọng đọc
    if (isShowVoice && !isPaused) {
      Tts.stop();
      speakText(currentChunk); // Phát lại đoạn văn bản hiện tại với cao độ mới
    }
  }, [pitch]);
  const paragraphs = chapter?.text[textIndex + 1]
    ?.replace(/\n\s*\n/g, "\n\n")
    .replace(/\n(?!\n)/g, " ")
    .split("\n\n") // Tách các đoạn văn theo dấu ngắt đoạn
    .flatMap(
      (paragraph: any) =>
        // Sử dụng regex để tách đoạn văn theo dấu câu và giữ dấu câu ở cuối đoạn
        paragraph.split(/(?<=[,\.!?:])\s+/g) // Tách đoạn văn sau dấu câu, sử dụng lookbehind để giữ dấu câu
    );
  const paragraphs2 = chapter?.text[textIndex + 1]
    ?.replace(/\n\s*\n/g, "\n\n")
    .replace(/\n(?!\n)/g, " ")
    .split("\n\n"); // Tách các đoạn văn theo dấu ngắt đoạn

  // Function để phát đoạn văn bản hiện tại
  const speakText = (chunkIndex: number) => {
    if (currentPage === pageIndex) {
      const chunk = paragraphs[chunkIndex]?.trim();
      console.log("chunk", chunk);
      if (chunk) {
        Tts.stop(); // Dừng giọng nói hiện tại nếu có

        Tts.speak(chunk); // Phát giọng nói của đoạn văn bản hiện tại
        setCurrentChunk(chunkIndex); // Cập nhật trạng thái trước khi phát
      } else {
        console.log("end");
        navigation.navigate("BookReader", {
          nextPage: currentPage + 1,
          bookId: id,
        });
      }
    }
  };

  useEffect(() => {
    const handleTtsFinish = () => {
      if (!isPaused) handleForward();
    };

    const ttsFinishListener = Tts.addListener("tts-finish", handleTtsFinish);

    return () => {
      ttsFinishListener.remove(); // Remove listener properly
    };
  }, [currentChunk, isPaused, pageIndex, isShowVoice]);
  const handleStartVoice = () => {
    if (!isShowVoice) {
      setIsShowVoice(true);

      speakText(currentChunk); // Bắt đầu từ đoạn hiện tại
    }
  };
  useEffect(() => {
    if (isShowVoice) {
      if (isNextPage) {
        speakText(currentChunk);
      }
      // if (!isPaused) {
      else {
        console.log("el");
        setCurrentChunk(0);
        handlePauseVoice();
      }
    }
  }, [currentPage]);

  const handlePauseVoice = () => {
    setIsPaused(true);
    Tts.stop(); // Dừng phát voice tạm thời
  };

  const handleResumeVoice = () => {
    setIsPaused(false);
    speakText(currentChunk); // Tiếp tục từ đoạn hiện tại
  };

  const handleStopVoice = () => {
    Tts.stop();
    setIsShowVoice(false);
    setCurrentChunk(0); // Reset lại từ đầu
  };

  const handleBackward = () => {
    if (currentChunk > 0) {
      speakText(currentChunk - 1); // Quay lại đoạn trước
    }
  };

  const handleForward = () => {
    speakText(currentChunk + 1);
  };
  return (
    <TouchableWithoutFeedback onPress={() => setShowModalTop(!showModalTop)}>
      <View
        style={{
          width: width,
          padding: bookType === "VOICE" ? sizes[currentSizeIndex].padding : 0,
          paddingTop: bookType === "VOICE" ? "18%" : 0,
          backgroundColor: bookType === "VOICE" ? backgroundColor : null,
        }}
      >
        {bookType === "VOICE" ? (
          paragraphs2.map((paragraph: string, index: number) => {
            const sentences = paragraph.split(/(?<=[,\.!?:])\s+/g); // Tách câu với lookbehind giữ lại dấu câu
            return (
              <Text
                key={index}
                selectable={true}
                style={{
                  textAlign:
                    readingDirection === "ltr"
                      ? "left"
                      : readingDirection === "rtl"
                      ? "right"
                      : "auto",
                  fontSize: sizes[currentSizeIndex].fontSize,
                  lineHeight: sizes[currentSizeIndex].lineHeight,
                  // color:
                  //   currentChunk === index && isShowVoice ? "blue" : textColor, // Highlight đoạn hiện tại
                  // color: isHighlighted ? "blue" : textColor,
                  fontFamily: fontFamily,
                }}
              >
                {sentences.map((sentence, sentenceIndex) => {
                  // Kiểm tra nếu câu hiện tại là câu đang được đọc để highlight
                  const isHighlighted = currentChunk === sentenceIndex;

                  return (
                    <Text
                      key={sentenceIndex}
                      style={{
                        color:
                          isHighlighted && isShowVoice ? "blue" : textColor, // Highlight câu hiện tại
                      }}
                    >
                      {sentence + " "}
                    </Text>
                  );
                })}
              </Text>
            );
          })
        ) : (
          <View>
            <Image
              source={{ uri: chapter?.images[textIndex] }}
              style={{
                width: width * 1.2,
                height,
                resizeMode: "stretch",
                marginLeft: -width * 0.1,
              }}
            />
          </View>
        )}

        {/* Modal Setting */}
        <Modal
          isVisible={isModalVisibleSetting}
          onBackdropPress={() => setModalVisibleSetting(false)}
          style={styles.modalSetting}
          backdropOpacity={0.2}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          backdropTransitionInTiming={600}
          backdropTransitionOutTiming={600}
          hideModalContentWhileAnimating={true}
        >
          <View style={styles.modalContentSetting}>
            <ScrollView style={{ width: width, gap: 10 }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  padding: 10,
                  textAlign: "center",
                  color: "black",
                }}
              >
                Cài đặt
              </Text>
              <View
                style={{
                  width: width,
                  borderBottomColor: "gray",
                  borderBottomWidth: 1,
                }}
              ></View>

              {/* Thay đổi hướng đọc */}
              <View style={styles.ViewOption}>
                <Text style={styles.TextOption}>Hướng đọc:</Text>
                <View style={styles.Option}>
                  <TouchableOpacity
                    onPress={() => setReadingDirection("ltr")}
                    style={{
                      backgroundColor:
                        readingDirection === "ltr" ? "gray" : "lightgray",
                      padding: 10,
                      borderRadius: 5,
                    }}
                  >
                    <Text style={{ color: "black" }}>Trái sang phải</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setReadingDirection("rtl")}
                    style={{
                      backgroundColor:
                        readingDirection === "rtl" ? "gray" : "lightgray",
                      padding: 10,
                      borderRadius: 5,
                    }}
                  >
                    <Text style={{ color: "black" }}>Phải sang trái</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={readingDirection === "ltr"}
                    onPress={() => setReadingDirection("ltr")}
                  >
                    <FontAwesome6
                      name="delete-left"
                      size={24}
                      color={readingDirection === "ltr" ? "gray" : "black"}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Thay đổi cỡ chữ */}
              <View style={styles.ViewOption}>
                <Text style={styles.TextOption}>Cỡ chữ:</Text>
                <View style={styles.Option}>
                  <TouchableOpacity
                    disabled={currentSizeIndex === 0}
                    onPress={() => handleFontSizeChange("plus")}
                  >
                    <AntDesign
                      name="minus"
                      size={24}
                      color={currentSizeIndex === 0 ? "gray" : "black"}
                    />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 20, color: "black" }}>
                    {sizes[currentSizeIndex].fontSize}
                  </Text>
                  <TouchableOpacity
                    disabled={currentSizeIndex === sizes.length - 1}
                    onPress={() => handleFontSizeChange("minus")}
                  >
                    <AntDesign
                      name="plus"
                      size={24}
                      color={
                        currentSizeIndex === sizes.length - 1 ? "gray" : "black"
                      }
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleFontSizeChange("reset")}
                    disabled={currentSizeIndex === 2}
                  >
                    <FontAwesome6
                      name="delete-left"
                      size={24}
                      color={currentSizeIndex === 2 ? "gray" : "black"}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Thay đổi màu chữ */}
              <View style={styles.ViewOption}>
                <Text style={styles.TextOption}>Màu chữ:</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setIsColorPickerVisible(true)}
                    style={{
                      backgroundColor: textColor,
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      borderColor: "gray",
                      borderWidth: 2,
                    }}
                  />
                  <TouchableOpacity
                    disabled={textColor === "black"}
                    onPress={() => setTextColor("black")}
                  >
                    <FontAwesome6
                      name="delete-left"
                      size={24}
                      color={textColor === "black" ? "gray" : "black"}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Thay đổi màu nền */}
              <View style={styles.ViewOption}>
                <Text style={styles.TextOption}>Màu nền:</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setIsBackgroundColorPickerVisible(true)}
                    style={{
                      backgroundColor: backgroundColor,
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      borderColor: "gray",
                      borderWidth: 2,
                    }}
                  />
                  <TouchableOpacity
                    disabled={backgroundColor === "white"}
                    onPress={() => setBackgroundColor("white")}
                  >
                    <FontAwesome6
                      name="delete-left"
                      size={24}
                      color={backgroundColor === "white" ? "gray" : "black"}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Thay đổi phông chữ */}
              <View style={styles.ViewOption}>
                <Text style={styles.TextOption}>Phông chữ:</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setIsFontPickerVisible(true)}
                    style={{
                      backgroundColor: "lightgray",
                      padding: 10,
                      borderRadius: 5,
                    }}
                  >
                    <Text style={{ color: "black" }}>{fontFamily}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={fontFamily === "sans-serif"}
                    onPress={() => setFontFamily("sans-serif")}
                  >
                    <FontAwesome6
                      name="delete-left"
                      size={24}
                      color={fontFamily === "sans-serif" ? "gray" : "black"}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setTextColor("black");
                    setBackgroundColor("white");
                    setFontFamily("sans-serif");
                    setReadingDirection("ltr");
                    setCurrentSizeIndex(2);
                  }}
                  style={{
                    backgroundColor: "gray",
                    padding: 10,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 18 }}>
                    Khôi phục cài đặt gốc
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>

        {/* Modal Chọn màu chữ */}
        <Modal
          isVisible={isColorPickerVisible}
          onBackdropPress={() => setIsColorPickerVisible(false)}
          style={styles.modalColorPicker}
          backdropOpacity={0.2}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          backdropTransitionInTiming={600}
          backdropTransitionOutTiming={600}
        >
          <View style={styles.colorPickerContent}>
            <Text style={styles.colorPickerTitle}>Chọn màu chữ</Text>
            <View style={styles.colorPalette}>
              {colorOptions.map((color) => (
                <TouchableOpacity
                  key={color}
                  onPress={() => {
                    setTextColor(color);
                    setIsColorPickerVisible(false);
                  }}
                  style={{
                    backgroundColor: color,
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    marginHorizontal: 5,
                    marginVertical: 10,
                    borderColor: color === textColor ? "black" : "gray",
                    borderWidth: 2,
                  }}
                />
              ))}
            </View>
          </View>
        </Modal>

        {/* Modal Chọn màu nền */}
        <Modal
          isVisible={isBackgroundColorPickerVisible}
          onBackdropPress={() => setIsBackgroundColorPickerVisible(false)}
          style={styles.modalColorPicker}
          backdropOpacity={0.2}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          backdropTransitionInTiming={600}
          backdropTransitionOutTiming={600}
        >
          <View style={styles.colorPickerContent}>
            <Text style={styles.colorPickerTitle}>Chọn màu nền</Text>
            <View style={styles.colorPalette}>
              {colorOptions.map((color) => (
                <TouchableOpacity
                  key={color}
                  onPress={() => {
                    setBackgroundColor(color);
                    setIsBackgroundColorPickerVisible(false);
                  }}
                  style={{
                    backgroundColor: color,
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    marginHorizontal: 5,
                    marginVertical: 10,
                    borderColor: color === backgroundColor ? "black" : "gray",
                    borderWidth: 2,
                  }}
                />
              ))}
            </View>
          </View>
        </Modal>

        {/* Modal Chọn phông chữ */}
        <Modal
          isVisible={isFontPickerVisible}
          onBackdropPress={() => setIsFontPickerVisible(false)}
          style={styles.modalColorPicker}
          backdropOpacity={0.2}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          backdropTransitionInTiming={600}
          backdropTransitionOutTiming={600}
        >
          <View style={styles.colorPickerContent}>
            <Text style={styles.colorPickerTitle}>Chọn phông chữ</Text>
            <View style={[styles.colorPalette, { gap: 10 }]}>
              {fontOptions.map((font) => (
                <TouchableOpacity
                  key={font}
                  onPress={() => {
                    setFontFamily(font);
                    setIsFontPickerVisible(false);
                  }}
                  style={{
                    padding: 10,
                    backgroundColor: fontFamily === font ? "gray" : "lightgray",
                    marginVertical: 5,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ fontFamily: font, fontSize: 18 }}>{font}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        {/* Modal top */}
        {showModalTop && (
          <View style={[styles.modal, styles.modalTop]}>
            <TouchableOpacity
              style={{ position: "absolute", left: 10, top: 10, padding: 10 }}
              onPress={handleExitPage}
            >
              <Icon name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={handleSearch}>
              <Feather name="search" size={24} color="#fff" />
            </TouchableOpacity>  */}
            {type === "VOICE" && (
              <TouchableOpacity
                // onPress={() => {
                //   console.log("object", chapter?.mp3s[textIndex]);
                //   setIsShowVoice(!isShowVoice);
                //   // playSound(chapter?.mp3s[textIndex]);
                // }}
                onPress={handleStartVoice}
              >
                <FontAwesome6 name="headphones-simple" size={24} color="#fff" />
              </TouchableOpacity>
            )}
            {/* <TouchableOpacity onPress={handleBookMark}>
              <FontAwesome name="bookmark" size={24} color="#fff" />
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => setModalVisibleSetting(true)}>
              <Ionicons name="settings" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalMucLucVisible(true)}>
              <FontAwesome name="list" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        {/* Modal cho Mục lục */}
        <Modal
          isVisible={isModalMucLucVisible}
          onBackdropPress={() => setModalMucLucVisible(false)}
          style={styles.modalMucLuc}
          backdropOpacity={0.2}
          animationIn="slideInLeft"
          animationOut="slideOutLeft"
        >
          <View style={styles.mucLucContent}>
            <TocPage
              widthH={width * 0.7}
              chapters={chapters}
              setCurrentPage={setCurrentPage}
              setChapter={setChapter}
            />
          </View>
        </Modal>
        {isShowVoice && (
          <View
            style={{
              position: "absolute",
              bottom: 40,
              left: width * 0.15,
              padding: 10,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              borderColor: "black",
              width: width * 0.7,
              height: 60,
              borderWidth: 1,
              borderRadius: 15,
              zIndex: 1000,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "75%",
              }}
            >
              <TouchableOpacity onPress={handleBackward}>
                <FontAwesome6 name="backward-step" size={29} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={isPaused ? handleResumeVoice : handlePauseVoice}
              >
                <Entypo
                  name={isPaused ? "controller-play" : "controller-paus"}
                  size={29}
                  color="black"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleStopVoice}>
                <Entypo name="controller-stop" size={29} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleForward}>
                <FontAwesome6 name="forward-step" size={29} color="black" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setModalSettingVoice(true)}>
              <Ionicons name="settings" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}
        <Modal
          isVisible={isModalSettingVoice}
          onBackdropPress={() => setModalSettingVoice(false)}
          style={styles.modalSetting}
          backdropOpacity={0.2}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          backdropTransitionInTiming={600}
          backdropTransitionOutTiming={600}
          hideModalContentWhileAnimating={true}
        >
          <View style={styles.modalContentSetting}>
            <ScrollView style={{ width: width, gap: 10 }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  padding: 10,
                  textAlign: "center",
                  color: "black",
                }}
              >
                Cài đặt giọng đọc
              </Text>
              <View
                style={{
                  width: width,
                  borderBottomColor: "gray",
                  borderBottomWidth: 1,
                }}
              ></View>

              {/* Thay đổi tốc độ đọc */}
              <View style={styles.ViewOption}>
                <Text style={styles.TextOption}>Tốc độ đọc:</Text>
                <Slider
                  style={{ width: 200, height: 40 }}
                  minimumValue={0.1}
                  maximumValue={2.0} // Tốc độ đọc cao nhất là 2x
                  value={speechRate}
                  onValueChange={(value) => setSpeechRate(value)}
                  minimumTrackTintColor="#1EB1FC"
                  maximumTrackTintColor="#1EB1FC"
                />
                <Text>{speechRate.toFixed(2)}</Text>
              </View>
              <View style={styles.ViewOption}>
                <Text style={styles.TextOption}>Cao độ (Pitch):</Text>
                <Slider
                  style={{ width: 200, height: 40 }}
                  minimumValue={0.5}
                  maximumValue={2.0}
                  value={pitch}
                  onValueChange={(value) => setPitch(value)}
                />
                <Text>{pitch.toFixed(2)}</Text>
              </View>
              {/* Thay đổi giọng đọc */}
              <View style={styles.ViewOption}>
                <Text style={styles.TextOption}>Chọn giọng đọc:</Text>
                <TouchableOpacity
                  onPress={() => setIsVoiceModalVisible(true)} // Mở modal khi nhấn vào giọng đọc hiện tại
                  style={{
                    padding: 10,
                    backgroundColor: "lightgray",
                    borderRadius: 5,
                    marginTop: 5,
                  }}
                >
                  <Text>
                    {voices.find((voice) => voice.id === selectedVoice)?.name ||
                      "Chọn giọng đọc"}
                  </Text>
                </TouchableOpacity>

                {/* Modal để chọn giọng đọc */}
                <Modal
                  isVisible={isVoiceModalVisible}
                  onBackdropPress={() => setIsVoiceModalVisible(false)} // Đóng modal khi nhấn ra ngoài
                  style={styles.modalColorPicker}
                  backdropOpacity={0.2}
                  animationIn="slideInUp"
                  animationOut="slideOutDown"
                  backdropTransitionInTiming={600}
                  backdropTransitionOutTiming={600}
                >
                  <View style={styles.colorPickerContent}>
                    <Text style={styles.colorPickerTitle}>Chọn giọng đọc</Text>
                    <View style={[styles.colorPalette, { gap: 10 }]}>
                      {voices.map((voice) => (
                        <TouchableOpacity
                          key={voice.id}
                          onPress={() => {
                            setSelectedVoice(voice.id);
                            setIsVoiceModalVisible(false); // Đóng modal sau khi chọn giọng đọc
                          }}
                          style={{
                            padding: 10,
                            backgroundColor:
                              selectedVoice === voice.id ? "gray" : "lightgray",
                            marginVertical: 5,
                            borderRadius: 5,
                          }}
                        >
                          <Text>{voice.name || voice.id}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </Modal>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChapterPage;

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
  modalSetting: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalContentSetting: {
    height: height * 0.4,
    backgroundColor: "white",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  ViewOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  TextOption: {
    width: "30%",
    fontSize: 20,
    color: "black",
  },
  Option: {
    width: "70%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalColorPicker: {
    justifyContent: "center",
    alignItems: "center",
  },
  colorPickerContent: {
    width: width * 0.8,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  colorPickerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  colorPalette: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  modalMucLuc: {
    justifyContent: "flex-start",
    margin: 0,
    marginTop: 0,
    marginBottom: 0,
    width: width * 0.7,
    position: "absolute",
    height: height,
    left: 0,
  },
  mucLucContent: {
    backgroundColor: "white",
    height: "100%",
    padding: 20,
  },
});
