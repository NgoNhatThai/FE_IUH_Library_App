import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const TocPage = ({ chapters, setCurrentPage, setChapter }: any) => {
  const calculatePageIndex = (chapterIndex: number) => {
    let pageIndex = 2; // Bắt đầu từ trang thứ 3 (bỏ qua trang bìa và mục lục)

    for (let i = 0; i < chapterIndex; i++) {
      // Mỗi chương có 1 trang tiêu đề + số trang hình ảnh của chương đó
      pageIndex += chapters[i].images.length + 1;
    }

    return pageIndex; // Trả về chỉ số trang của chương hiện tại
  };
  return (
    <View style={{ width }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", padding: 10 }}>
        Mục lục
      </Text>
      {chapters.map((chapter: any, i: number) => (
        <TouchableOpacity
          key={i}
          onPress={() => {
            // trang đầu tiên là bìa, trang thứ 2 là mục lục, trang thứ 3 là trang đầu tiên của chương 1 tức là 2 + 0 * chapter.images.length = 2
            // chương 2 thì là 2 + 0 * chapter.images.length + 1 * chapter.images.length = ...
            // chương 3 thì là 2 + 0 * chapter.images.length + 1 * chapter.images.length + 2 * chapter.images.length = ...
            // chương 4 thì là 2 + 0 * chapter.images.length + 1 * chapter.images.length + 2 * chapter.images.length + 3 * chapter.images.length = ...
            // tiếp tục như vậy cho tới hết cuốn sách
            // bây giờ hãy thử chuyển trang từ mục lục sang chương 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20

            // setCurrentPage(2 + i * chapter.images.length);
            // setChapter(i * chapter.images.length);
            const pageIndex = calculatePageIndex(i);
            setChapter(pageIndex);
          }}
        >
          <Text style={{ padding: 10 }}>{chapter.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TocPage;
