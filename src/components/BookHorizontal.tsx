import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

type BookProps = {
  category?: string;
  image: string;
  titleBottom?: string;
  bookTitle: string;
  authorName: string;
  detele?: boolean;
  onDetete?: () => void;
  onPress: () => void;
  onPressCategory?: () => void;
  isDowload?: boolean;
  fileSize?: string;
  onPressDeteleDowload?: () => void;
  star: number;
  type?: string;
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
  onPressCategory,
  isDowload,
  fileSize,
  onPressDeteleDowload,
  star,
  type,
}) => {
  const [modalMenuVisible, setModalMenuVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const handleEllipsisPress = (event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    setModalPosition({ x: pageX, y: pageY });
    setModalMenuVisible(true);
  };
  const formatMoney = (n: String) => {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const renderMenu = () => (
    <Modal
      transparent={true}
      visible={modalMenuVisible}
      onRequestClose={() => setModalMenuVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        onPress={() => setModalMenuVisible(false)}
      >
        <View
          style={[
            styles.modalMenu,
            { top: modalPosition.y, left: modalPosition.x - 180 },
          ]}
        >
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              setModalMenuVisible(false);
              onPressDeteleDowload && onPressDeteleDowload();
            }}
          >
            <Text style={styles.menuText}>Xóa bản tải xuống</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
        {type && type != "NORMAL" && (
          <View style={styles.typeBadge}>
            <Text style={styles.priceText}>
              {type == "IMAGE" ? "PDF" : "EPUB"}
            </Text>
          </View>
        )}
        {titleBottom && (
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>{formatMoney(titleBottom)} đ</Text>
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
          <TouchableOpacity
            onPress={onPressCategory}
            style={styles.categoryButton}
          >
            <Text style={styles.categoryButtonText}>{category}</Text>
          </TouchableOpacity>
        )}

        {isDowload ? (
          <View style={styles.bottomRow}>
            <MaterialIcons name="storage" size={17} color="#E48641" />
            <Text
              style={{
                fontSize: 16,
                color: "#E48641",
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 5,
              }}
            >
              {fileSize}
            </Text>
          </View>
        ) : (
          <View style={styles.bottomRow}>
            <Text style={styles.statText}>⭐ {star.toFixed(1)}</Text>
          </View>
        )}
      </View>
      {isDowload && (
        <TouchableOpacity
          onPress={(e) => handleEllipsisPress(e)}
          style={{ width: width * 0.08, justifyContent: "center" }}
        >
          <Ionicons name="ellipsis-vertical" size={23} color={"#f07b3f"} />
        </TouchableOpacity>
      )}
      {renderMenu()}
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
  typeBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FF9F43",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  priceBadge: {
    position: "absolute",
    bottom: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalMenu: {
    position: "absolute",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  menuButton: {
    padding: 10,
  },
  menuText: {
    fontSize: 16,
    color: "black",
  },
  statText: {
    fontSize: 16,
    color: "black",
    marginRight: 20,
  },
});

export default BookHorizontal;
