import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

type BookProps = {
  category?: string;
  image: string;
  titleBottom?: string;
  bookTitle: string;
  authorName: string;
  detele?: boolean;
  onDetete?: () => void;
  onPress: () => void;
};

const { width } = Dimensions.get("window");

const BookHorizontal: React.FC<BookProps> = ({
  category,
  image,
  titleBottom,
  bookTitle,
  authorName,
  onPress,
  detele,
  onDetete,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
        {titleBottom && (
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>{titleBottom}</Text>
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
        {category && (
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryButtonText}>{category}</Text>
          </TouchableOpacity>
        )}
        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.heartIcon}>
            <Icon name="heart" size={20} color="#000" />
          </TouchableOpacity>
          <Text style={styles.likesCount}>402</Text>
        </View>
      </View>
      {detele && (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 5,
            right: 5,
            backgroundColor: "#CDCDCB",
            borderRadius: 50,
            width: 20,
            height: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={onDetete}
        >
          <MaterialIcons name="clear" size={17} color="#000" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: width * 0.9,
    margin: 7,
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
    width: 130,
    height: 160,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  priceBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#2D9CDB",
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
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  authorName: {
    fontSize: 14,
    color: "#666",
  },
  categoryButton: {
    alignSelf: "flex-start",
    backgroundColor: "#fff0e6",
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E48641",
    marginTop: 5,
  },
  categoryButtonText: {
    color: "#E48641",
    fontSize: 12,
    fontWeight: "bold",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  heartIcon: {
    marginRight: 5,
  },
  likesCount: {
    fontSize: 14,
    color: "#333",
  },
});

export default BookHorizontal;
