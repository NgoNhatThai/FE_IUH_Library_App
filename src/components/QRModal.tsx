import React, { useState, useEffect } from "react";
import {
  Modal,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

interface QRModalProps {
  visibleModal: boolean;
  handleOpenOrCloseQRModal: () => void;
  bankAccountDetail?: any;
  amount?: number;
  userId?: string;
  handleFinish?: () => void;
}

const QRModal = ({
  visibleModal,
  handleOpenOrCloseQRModal,
  bankAccountDetail,
  amount,
  userId,
  handleFinish,
}: QRModalProps) => {
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true); // State để kiểm tra quá trình tải hình ảnh

  // Reset trạng thái khi modal mở lại
  useEffect(() => {
    if (visibleModal) {
      setIsImageLoading(true); // Đặt lại trạng thái mỗi khi mở modal
    }
  }, [visibleModal]);

  // Tạo nội dung chuyển khoản
  const transferNote = `${userId}-${new Date().toISOString()}`;

  return (
    <Modal
      visible={visibleModal}
      transparent={true}
      animationType="slide"
      onRequestClose={handleOpenOrCloseQRModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>QR Thanh toán</Text>

          <View style={styles.qrContainer}>
            {isImageLoading && ( // Hiển thị ActivityIndicator khi hình ảnh đang tải
              <ActivityIndicator
                style={styles.activityIndicator}
                size="large"
                color="#0000ff"
              />
            )}
            <Image
              style={styles.qrImage}
              source={{
                uri: `https://img.vietqr.io/image/${bankAccountDetail?.bankId}-${bankAccountDetail?.accountNumber}-compact2.png?amount=${amount}&accountName=${bankAccountDetail?.accountName}&addInfo=${transferNote}`,
              }}
              onLoad={() => setIsImageLoading(false)} // Ẩn ActivityIndicator khi hình ảnh đã tải xong
              onError={() => setIsImageLoading(false)} // Ẩn ActivityIndicator nếu tải hình ảnh gặp lỗi
            />
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Tên ngân hàng</Text>
            <Text style={styles.value}>
              {bankAccountDetail?.bankName || ""}
            </Text>

            <Text style={styles.label}>Tên chủ tài khoản</Text>
            <Text style={styles.value}>
              {bankAccountDetail?.accountName || ""}
            </Text>

            <Text style={styles.label}>Số tài khoản</Text>
            <Text style={styles.value}>
              {bankAccountDetail?.accountNumber || ""}
            </Text>

            <Text style={styles.label}>Số tiền</Text>
            <Text style={styles.value}>{amount || ""}</Text>

            <Text style={styles.label}>Nội dung chuyển khoản</Text>
            <Text style={styles.value}>{transferNote}</Text>
          </View>

          <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
            <Text style={styles.finishButtonText}>Hoàn tất</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  qrContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  qrImage: {
    width: 250,
    height: 230,
  },
  activityIndicator: {
    position: "absolute",
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  finishButton: {
    backgroundColor: "#E48641",
    borderRadius: 8,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  finishButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default QRModal;
