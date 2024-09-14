import React, { useCallback, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
} from "react-native";
import axiosPrivate from "../../api/axiosPrivate";
import { useAuth } from "../../context/AuthContext";
import AntDesign from "react-native-vector-icons/AntDesign";
import Fontisto from "react-native-vector-icons/Fontisto";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");

export default function BookDetail_Comment({ navigation, route }: any) {
  const { user } = useAuth();
  const [data, setData] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [commentText, setCommentText] = useState("");
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get(
        `book/get-detail-book/${route.params.book._id}`
      );

      setData(response?.data?.data?.review?.comments);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [route.params.book._id])
  );
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCommentVisible, setModalCommentVisible] = useState(false);
  const HandleComment = async () => {
    if (!user) {
      setModalVisible(true);
      return;
    } else {
      setModalCommentVisible(true);
    }
  };
  const renderLoginModal = () => (
    <Modal
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Bạn cần đăng nhập</Text>
          <Text style={styles.modalText}>
            Để tiếp tục thao tác này, vui lòng đăng nhập.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("SignIn");
              }}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
  const Comment = async () => {
    if (commentText.trim()) {
      try {
        const res = await axiosPrivate.post(`user/comment`, {
          userId: user?.studentCode?._id,
          bookId: route.params.book._id,
          comment: commentText,
        });

        setCommentText("");
        setModalCommentVisible(false);
        fetchData();
      } catch (error) {
        console.log(error);
      }
    }
  };
  const renderCommentModal = () => (
    <Modal
      transparent={true}
      visible={modalCommentVisible}
      onRequestClose={() => setModalCommentVisible(false)}
    >
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
            width: width * 0.9,
            padding: 16,
            backgroundColor: "#fff",
            borderRadius: 10,
            alignItems: "center",
            gap: 19,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              borderBottomWidth: 1,
              borderBottomColor: "gray",
              paddingBottom: 5,
            }}
          >
            <Text
              style={{
                fontSize: 19,
                fontWeight: "bold",
                width: "95%",
                textAlign: "center",
                color: "black",
              }}
            >
              Bình luận mới
            </Text>
            <TouchableOpacity onPress={() => setModalCommentVisible(false)}>
              <AntDesign name="close" size={25} color={"black"} />
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Nhập bình luận..."
            multiline
            value={commentText}
            onChangeText={(text) => setCommentText(text)}
            style={{
              width: "100%",
              height: 100,
              textAlignVertical: "top",
              padding: 10,
              fontSize: 17,
              color: "black",
              backgroundColor: "#f0f0f0",
              borderRadius: 10,
            }}
          />

          <View style={{}}>
            <TouchableOpacity
              onPress={Comment}
              disabled={!commentText.trim()}
              style={[
                styles.commentButton,
                { backgroundColor: commentText.trim() ? "#f07b3f" : "#ddd" },
              ]}
            >
              <Text style={styles.commentButtonText}>Bình luận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
  const [modalRatingVisible, setModalRatingVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const Rating = async () => {
    if (rating > 0) {
      try {
        const res = await axiosPrivate.post(`user/rate`, {
          userId: user?.studentCode?._id,
          bookId: route.params.book._id,
          rating: rating,
        });
        setRating(0);
        setModalRatingVisible(false);
        fetchData();
      } catch (error) {
        console.log(error);
      }
    }
  };
  const renderRatingModal = () => (
    <Modal
      transparent={true}
      visible={modalRatingVisible}
      onRequestClose={() => setModalRatingVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Đánh giá sách</Text>
            <TouchableOpacity onPress={() => setModalRatingVisible(false)}>
              <AntDesign name="close" size={25} color={"black"} />
            </TouchableOpacity>
          </View>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={{ marginHorizontal: 5 }}
              >
                <AntDesign
                  name={star <= rating ? "star" : "staro"}
                  size={30}
                  color={star <= rating ? "#f07b3f" : "#ddd"}
                />
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            onPress={Rating}
            style={[
              styles.ratingButton,
              { backgroundColor: rating > 0 ? "#f07b3f" : "#ddd" },
            ]}
            disabled={rating === 0}
          >
            <Text style={styles.ratingButtonText}>Gửi đánh giá</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  const [modalMenuVisible, setModalMenuVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const handleEllipsisPress = (event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    setModalPosition({ x: pageX, y: pageY });
    setModalMenuVisible(true);
  };
  const renderItem = ({ item }: any) => {
    return (
      <View
        style={{
          width: width,
          padding: 10,
          height: 150,
          borderBottomWidth: 2,
          borderBottomColor: "gray",
        }}
      >
        <View style={{ flexDirection: "row", gap: 15 }}>
          <Image
            source={{ uri: item.user.avatar }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 100,
            }}
          />
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ fontWeight: "bold", fontSize: 19, color: "black" }}>
              {item?.user?.userName}
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 10 }}>
              {item?.createdAt.slice(0, 10)}
            </Text>
            <Text style={{ fontSize: 17, color: "black" }}>{item.content}</Text>
            <View style={{ flexDirection: "row", gap: 20 }}>
              <Text style={{ fontSize: 17, color: "black" }}>
                <AntDesign name="hearto" size={23} /> 0
              </Text>
              <Text style={{ fontSize: 17, color: "black" }}>🗨️ 0</Text>
            </View>
          </View>
          {user?.studentCode?._id === item.user._id && (
            <TouchableOpacity
              onPress={(e) => handleEllipsisPress(e)}
              style={{ width: width * 0.08, justifyContent: "center" }}
            >
              <Ionicons name="ellipsis-vertical" size={23} color={"#f07b3f"} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
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
            { top: modalPosition.y, left: modalPosition.x - 120 },
          ]}
        >
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              setModalMenuVisible(false);
              // Handle edit action here
            }}
          >
            <Text style={styles.menuText}>Chỉnh sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              setModalMenuVisible(false);
              // Handle delete action here
            }}
          >
            <Text style={styles.menuText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : data.length > 0 ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "black", fontSize: 17 }}>
            Hãy là người đầu tiên bình luận
          </Text>
        </View>
      )}
      <TouchableOpacity
        onPress={HandleComment}
        style={{
          position: "absolute",
          bottom: 80,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: 100,
          backgroundColor: "#f07b3f",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Fontisto name="commenting" size={30} color={"white"} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setModalRatingVisible(true)}
        style={{
          position: "absolute",
          bottom: 10,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: 100,
          backgroundColor: "#f07b3f",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AntDesign name="staro" size={30} color={"white"} />
      </TouchableOpacity>
      {renderLoginModal()}
      {renderCommentModal()}
      {renderRatingModal()}
      {renderMenu()}
    </View>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  loginButton: {
    backgroundColor: "#f07b3f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
  },
  commentButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  commentButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    paddingBottom: 10,
  },
  starsContainer: {
    flexDirection: "row",
    marginVertical: 20,
    justifyContent: "center",
  },
  ratingButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  ratingButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
});
