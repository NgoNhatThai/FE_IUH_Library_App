import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

type BookRecentlyProps = {
  bookID: string;
  image: string;
  title: string;
  percent?: number;
  catergory?: string;
  author?: string;
  onPress: (bookID: string) => void;
};

const { width } = Dimensions.get("window");

const ITEM_MARGIN = 6;
const ITEM_WIDTH = (width - ITEM_MARGIN * 4) / 2;

const BookRecently: React.FC<BookRecentlyProps> = ({
  bookID,
  image,
  title,
  percent,
  author,
  catergory,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(bookID)}
      activeOpacity={0.8}
    >
      <View style={styles.row}>
        <Image source={{ uri: image }} style={styles.image} />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            gap: 5,
          }}
        >
          {/* style cho author và catergory đẹp tí nào */}
          <Text style={styles.title}>{title}</Text>
          <Text
            style={{
              fontSize: 12,
              color: "#333",
            }}
          >
            {author}
          </Text>
        </View>
      </View>
      {percent !== undefined && (
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${percent >= 80 ? percent - 20 : percent}%` },
            ]}
          />
          <Text style={styles.percentText}>{percent}%</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: ITEM_WIDTH,
    margin: ITEM_MARGIN,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    padding: 7,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: ITEM_WIDTH * 0.35,
    height: ITEM_WIDTH * 0.4,
    resizeMode: "cover",
    borderRadius: 5,
    marginRight: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    marginTop: 10,
    backgroundColor: "#f0f0f0",
    height: 14,
    borderRadius: 7,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#76c7c0",
    borderRadius: 3,
  },
  percentText: {
    marginLeft: 8,
    fontSize: 11,
    color: "#333",
    fontWeight: "bold",
  },
});

export default BookRecently;
