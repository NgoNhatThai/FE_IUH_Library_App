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
} from "react-native";
import axiosPrivate from "../../../api/axiosPrivate";
import { useAuth } from "../../../context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import BookHorizontal from "../../../components/BookHorizontal";

const { width, height } = Dimensions.get("window");

export default function Following({ navigation }: any) {
  const { user } = useAuth();
  const [data, setData] = React.useState<any>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [modalVisibleDeleteALl, setModalVisibleDeleteALl] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get(
        `user/get-follow-list?userId=${user?.studentCode._id}&pageIndex=0&pageSize=10`
      );
      setData(response?.data?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderItem = ({ item }: any) => {
    return (
      <BookHorizontal
        category={item?.categoryId?.name}
        image={item?.image}
        titleBottom={item?.price.toString()}
        bookTitle={item?.title}
        authorName={item?.authorId?.name}
        onPress={() => {
          navigation.navigate("BookDetails", { bookId: item._id });
        }}
        onPressCategory={() => {
          navigation.navigate("CatergoryDetail", { item: item?.categoryId });
        }}
      />
    );
  };

  const HandleDeleteAll = async () => {
    try {
      for (let i = 0; i < data.length; i++) {
        await axiosPrivate.get(
          `user/un-follow?userId=${user?.studentCode?._id}&bookId=${data[i]?._id}`
        );
      }
      await fetchData();
    } catch (error) {
      console.log(error);
    }
  };
  const renderDeleteAllModal = () => (
    <Modal
      transparent={true}
      visible={modalVisibleDeleteALl}
      onRequestClose={() => setModalVisibleDeleteALl(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* <Text style={styles.modalTitle}>Bạn cần đăng nhập</Text> */}
          <Text style={styles.modalText}>
            Bạn có chắc chắn muốn xóa tất cả sách đã theo dõi?
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                setModalVisibleDeleteALl(false);
                HandleDeleteAll();
              }}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Đồng ý</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisibleDeleteALl(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
  return (
    <LinearGradient
      colors={["#F3EAC1", "#E0F7F4"]}
      style={{ flex: 1, alignItems: "center" }}
    >
      {loading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : data.length > 0 ? (
        <>
          <View
            style={{
              width: width,
              height: height * 0.06,
              padding: 11,
              backgroundColor: "#fff",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "black" }}>
              {data.length} sách
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisibleDeleteALl(true)}
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 16, color: "black" }}>Xóa tất cả</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={data}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={{ borderWidth: 1, borderColor: "red" }}
          />
        </>
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
            Bạn chưa theo dõi sách nào
          </Text>
        </View>
      )}
      {renderDeleteAllModal()}
    </LinearGradient>
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
    backgroundColor: "#ff3333",
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
});
