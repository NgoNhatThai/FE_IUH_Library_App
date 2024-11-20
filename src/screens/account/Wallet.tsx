import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useAuth } from "../../context/AuthContext";
import axiosPrivate from "../../api/axiosPrivate";
import { useFocusEffect } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");
import { DataTable } from "react-native-paper";
import moment from "moment";
type Amount = {
  total: number;
  history: any[];
};
export default function Wallet({ navigation }: any) {
  const { config, logout, user } = useAuth();
  const [anmount, setAnmount] = useState<Amount>({ total: 0, history: [] });
  const [loading, setLoading] = useState(false); // Loading state
  const [isChoose, setIsChoose] = useState("history");
  const [request, setRequest] = useState([]);
  const [page, setPage] = useState(0);
  const itemsPerPage = 6;
  const fetchDataRequest = async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get(
        `user/get-pending-request?userId=${user?.studentCode._id}`
      );
      setRequest(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const getAmount = async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get(
        `user/get-user-amount?userId=${user?.studentCode._id}`
      );
      setAnmount(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getAmount();
    }, [])
  );
  const formatCash = (cash: number) => {
    return cash?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const renderTransactionTable = () => (
    <DataTable style={styles.tableContainer}>
      <DataTable.Header>
        <DataTable.Title style={styles.sttColumn}>STT</DataTable.Title>
        <DataTable.Title style={styles.amountColumn}>Số tiền</DataTable.Title>
        <DataTable.Title style={styles.descriptionColumn}>
          Mô tả giao dịch
        </DataTable.Title>
        <DataTable.Title style={styles.dateColumn}>
          Ngày giao dịch
        </DataTable.Title>
      </DataTable.Header>
      {anmount?.history
        .slice(page * itemsPerPage, (page + 1) * itemsPerPage)
        .map((transaction: any, index: any) => (
          <DataTable.Row key={transaction._id} style={styles.row}>
            <DataTable.Cell style={styles.sttColumn}>
              {page * itemsPerPage + index + 1}
            </DataTable.Cell>
            <DataTable.Cell style={styles.amountColumn}>
              {formatCash(transaction.amount)}
            </DataTable.Cell>
            <DataTable.Cell style={styles.descriptionColumn}>
              {transaction.amount < 0 ? (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("BookDetails", {
                      bookId: transaction?.detail?._id,
                    });
                  }}
                >
                  <Text style={{ color: "black" }}> Mua sách</Text>
                </TouchableOpacity>
              ) : (
                "Nạp tiền"
              )}
            </DataTable.Cell>
            <DataTable.Cell style={styles.dateColumn}>
              {moment(transaction.date).format("DD-MM-YYYY")}
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(anmount?.history?.length / itemsPerPage)}
        onPageChange={(page) => setPage(page)}
        label={`${page * itemsPerPage + 1}-${(page + 1) * itemsPerPage} of ${
          anmount?.history?.length
        }`}
        showFastPaginationControls
      />
    </DataTable>
  );
  const handleCancelRequest = async (requestId: any) => {
    try {
      await axiosPrivate.delete(`user/cancel-request/${requestId}`);
      Alert.alert("Thông báo", "Yêu cầu đã được hủy thành công");
      fetchDataRequest();
    } catch (error) {
      Alert.alert("Thông báo", "Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const renderRequestTable = () => (
    <DataTable style={styles.tableContainer}>
      <DataTable.Header>
        <DataTable.Title style={styles.sttColumn}>STT</DataTable.Title>
        <DataTable.Title style={styles.amountColumn}>Số tiền</DataTable.Title>
        <DataTable.Title style={styles.dateColumn}>Ngày nạp</DataTable.Title>
        <DataTable.Title style={styles.actionColumn}>Tùy chọn</DataTable.Title>
      </DataTable.Header>
      {request
        .slice(page * itemsPerPage, (page + 1) * itemsPerPage)
        .map((req: any, index: any) => (
          <DataTable.Row key={req._id} style={styles.row}>
            <DataTable.Cell style={styles.sttColumn}>
              {page * itemsPerPage + index + 1}
            </DataTable.Cell>
            <DataTable.Cell style={styles.amountColumn}>
              {formatCash(req.amount)}
            </DataTable.Cell>
            <DataTable.Cell style={styles.dateColumn}>
              {moment(req.date).format("DD-MM-YYYY")}
            </DataTable.Cell>
            <DataTable.Cell style={styles.actionColumn}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelRequest(req._id)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(request.length / itemsPerPage)}
        onPageChange={(page) => setPage(page)}
        label={`${page * itemsPerPage + 1}-${(page + 1) * itemsPerPage} of ${
          request.length
        }`}
        showFastPaginationControls
      />
    </DataTable>
  );
  return (
    <LinearGradient colors={["#F3EAC1", "#E0F7F4"]} style={styles.container}>
      {loading ? (
        // Show loading spinner when data is being fetched
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              height: 50,
              alignItems: "center",
              padding: 10,
              gap: 15,
            }}
          >
            <TouchableOpacity
              style={styles.goBackButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={26} color="black" />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "black" }}>
              Tiền trong ví
            </Text>
          </View>
          <View
            style={{ width: "100%", height: 1, backgroundColor: "black" }}
          ></View>
          <View
            style={{
              marginTop: 10,
              width: "92%",
              height: 160,
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
                gap: 10,
              }}
            >
              <FontAwesome name="bitcoin" size={40} color="#E48641" />
              <Text
                style={{ fontSize: 28, color: "black", fontWeight: "bold" }}
              >
                {formatCash(anmount?.total)} VNĐ
              </Text>
            </View>
            <Text style={{ fontSize: 20, color: "gray" }}>
              Dùng để mua sách
            </Text>
            <TouchableOpacity
              style={{
                width: "90%",
                height: 50,
                backgroundColor: "#E48641",
                borderRadius: 40,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
              }}
              onPress={() => {
                navigation.navigate("Deposit");
              }}
            >
              <Text
                style={{ fontSize: 20, color: "white", fontWeight: "bold" }}
              >
                Nạp tiền
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "92%",
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              style={{
                width: "48%",
                height: 50,
                borderRadius: 15,
                borderColor: isChoose === "history" ? "#E48641" : "gray",
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                setIsChoose("history");
                getAmount();
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: isChoose === "history" ? "#E48641" : "gray",
                  fontWeight: "bold",
                }}
              >
                Lịch sử giao dịch
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: "48%",
                height: 50,
                borderRadius: 15,
                borderColor: isChoose === "request" ? "#E48641" : "gray",
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                setIsChoose("request");
                fetchDataRequest();
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: isChoose === "request" ? "#E48641" : "gray",
                  fontWeight: "bold",
                }}
              >
                Yêu cầu đang chờ
              </Text>
            </TouchableOpacity>
          </View>
          {isChoose === "history"
            ? renderTransactionTable()
            : renderRequestTable()}
        </>
      )}
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  list: {},
  goBackButton: {
    borderRadius: 20,
  },
  tableContainer: {
    width: "97%",
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sttColumn: {
    flex: 0.3,
    justifyContent: "center",
    textAlign: "center",
  },
  amountColumn: {
    flex: 1,
    justifyContent: "center",
    textAlign: "right",
  },
  dateColumn: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
  },
  actionColumn: {
    flex: 0.7,
    justifyContent: "center",
    textAlign: "center",
  },
  row: {
    borderBottomColor: "#F0F0F0",
    borderBottomWidth: 1,
  },
  cancelButton: {
    backgroundColor: "#FF4500",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "92%",
    marginTop: 20,
  },
  tabButton: {
    width: "48%",
    height: 50,
    borderRadius: 15,
    borderColor: "gray",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activeTab: {
    borderColor: "#E48641",
  },
  tabText: {
    fontSize: 20,
    color: "gray",
    fontWeight: "bold",
  },
  activeTabText: {
    color: "#E48641",
  },
});
