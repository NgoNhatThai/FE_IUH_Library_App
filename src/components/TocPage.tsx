import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const TocPage = ({ chapters, setCurrentPage }: any) => (
  <View style={{ width }}>
    <Text style={{ fontSize: 24, fontWeight: "bold", padding: 10 }}>
      Mục lục
    </Text>
    {chapters.map((chapter: any, i: number) => (
      <TouchableOpacity
        key={i}
        onPress={() => setCurrentPage(2 + i * chapter.images.length)}
      >
        <Text style={{ padding: 10 }}>{chapter.title}</Text>
      </TouchableOpacity>
    ))}
  </View>
);
export default TocPage;
