import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../context/AuthContext";
import axiosPrivate from "../../api/axiosPrivate";
import { useFocusEffect } from "@react-navigation/native";
import ModalDropdown from "react-native-modal-dropdown";
import { ToastError, ToastSuscess } from "../../utils/function";
import QRModal from "../../components/QRModal";

const { width, height } = Dimensions.get("window");

type bank = {
  _id: string;
  bankId: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
};

export default function Deposit({ navigation }: any) {
  const { config, logout, user } = useAuth();
  const [dataBank, setDataBank] = useState<bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBank, setSelectedBank] = useState<string>("Chọn ngân hàng...");
  const [amount, setAmount] = useState<string>(""); // State để lưu số tiền
  const [openQR, setOpenQR] = useState<boolean>(false); // State cho modal QR
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get(`admin/get-bank-account`);
      setDataBank(response?.data?.data || []);
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
  const bankItems = dataBank.map((bank) => {
    return {
      label: `${bank.bankName}\nSTK: ${bank.accountNumber} - ${bank.accountName}`,
      id: bank._id,
      bankId: bank.bankId,
      accountNumber: bank.accountNumber,
      accountName: bank.accountName,
      bankName: bank.bankName,
    };
  });
  const selectedBankAccount = bankItems.find(
    (item) => item.id === selectedBank
  );

  const handleComplete = () => {
    if (selectedBank === "Chọn ngân hàng...") {
      ToastError({ text1: "Lỗi", text2: "Vui lòng chọn tài khoản ngân hàng." });
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      ToastError({
        text1: "Lỗi",
        text2: "Vui lòng nhập số tiền hợp lệ lớn hơn 0.",
      });
      return;
    }

    setOpenQR(true); // Mở modal QR nếu các điều kiện đều hợp lệ
  };
  const handleFinish = async () => {
    try {
      const res = await axiosPrivate.post("user/request-amount", {
        userId: user?.studentCode?._id,
        bankConfigId: selectedBankAccount?.id,
        amount: parseFloat(amount),
      });
      console.log("res", res.data);
      setOpenQR(false);
      ToastSuscess({
        text1: "Thành công",
        text2: "Gửi yêu cầu nạp tiền thành công!",
      });
      // reset lại giá trị
      setSelectedBank("Chọn ngân hàng...");
      setAmount("");
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <LinearGradient colors={["#F3EAC1", "#E0F7F4"]} style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.goBackButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={26} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Nạp tiền</Text>
          </View>
          <View style={styles.separator} />

          <View style={styles.contentContainer}>
            <Text style={styles.labelText}>Chọn tài khoản nhận:</Text>
            {bankItems?.length > 0 ? (
              <ModalDropdown
                options={bankItems.map((item) => item.label)}
                renderRow={(item) => (
                  <View style={styles.dropdownItem}>
                    <Text style={styles.dropdownItemLabel}>
                      {item.split("\n")[0]}
                    </Text>
                    <Text style={styles.dropdownItemDescription}>
                      {item.split("\n")[1]}
                    </Text>
                  </View>
                )}
                style={styles.dropdown}
                textStyle={styles.dropdownText}
                dropdownStyle={styles.dropdownMenu}
                defaultValue={selectedBank}
                onSelect={(index: any) => {
                  setSelectedBank(bankItems[index].id);
                }}
              />
            ) : (
              <Text style={styles.noDataText}>
                Không có tài khoản ngân hàng nào để hiển thị
              </Text>
            )}
            <Text style={styles.labelText}>Nhập số tiền cần nạp:</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập số tiền"
              keyboardType="numeric"
              value={amount}
              onChangeText={(text) => setAmount(text)}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleComplete}
            >
              <Text style={styles.submitButtonText}>Hoàn tất</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {/* Modal QR */}
      <QRModal
        visibleModal={openQR}
        handleOpenOrCloseQRModal={() => setOpenQR(!openQR)}
        amount={parseFloat(amount)}
        bankAccountDetail={selectedBankAccount}
        userId={user?.studentCode?._id}
        handleFinish={handleFinish}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    alignItems: "center",
    padding: 10,
    gap: 15,
  },
  goBackButton: {
    borderRadius: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "black",
  },
  contentContainer: {
    marginTop: 10,
    width: "95%",
    height: 250,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  labelText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 5,
    fontWeight: "600",
  },
  noDataText: {
    fontSize: 16,
    color: "#ff0000",
    marginTop: 10,
    textAlign: "center",
  },
  dropdown: {
    borderColor: "#E48641",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#FFF",
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  dropdownMenu: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 8,
    elevation: 3,
    marginTop: 5,
    height: 250,
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownItem: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  dropdownItemLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  dropdownItemDescription: {
    fontSize: 14,
    color: "#666",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  submitButton: {
    width: "90%",
    height: 50,
    backgroundColor: "#E48641",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitButtonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
});
