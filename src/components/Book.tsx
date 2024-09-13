import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

type BookProps = {
  category?: string;
  image: string;
  titleBottom?: string;
  bookTitle: string;
  authorName: string;
  onPress: () => void;
};

const { width } = Dimensions.get("window");

const Book: React.FC<BookProps> = ({
  category,
  image,
  titleBottom,
  bookTitle,
  authorName,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
        {category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        )}
        {titleBottom && (
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>{titleBottom} VNĐ</Text>
          </View>
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {bookTitle}
        </Text>
        <Text style={styles.authorName} numberOfLines={1}>
          {authorName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const ITEM_MARGIN = 6;
const ITEM_WIDTH = (width - ITEM_MARGIN * 6) / 3;

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
  },
  imageContainer: {
    width: "100%",
    height: ITEM_WIDTH * 1.5,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  categoryBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#C227DD",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  categoryText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  priceBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "#68CAE3",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  priceText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  infoContainer: {
    padding: 4,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  authorName: {
    fontSize: 12,
    color: "#666",
  },
});

export default Book;
