import React, { useState, useEffect } from "react";
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import axiosPrivate from "../../../api/axiosPrivate";
import { useAuth } from "../../../context/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";

const screenWidth = Dimensions.get("window").width;

export default function PersonalStatistics({ navigation }: any) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [isChoose, setIsChoose] = useState("read");
  const [dataRead, setDataRead] = useState<any>({ labels: [], datasets: [] });
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const getDataRead = async () => {
    setLoading(true);
    if (startDate && endDate) {
      try {
        console.log("id", user?.studentCode?._id);
        const formattedStartDate = new Date(
          startDate.getTime() - startDate.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split("T")[0];
        const formattedEndDate = new Date(
          endDate.getTime() - endDate.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split("T")[0];

        const response = await axiosPrivate(
          `overview/get-read-time-overview?startDate=${formattedStartDate}&endDate=${formattedEndDate}&userId=${user?.studentCode?._id}`
        );
        console.log("res", response.data.details[0]);
        setDataRead(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    setLoading(false);
  };
  const [dataThuChi, setDataThuChi] = useState<any>({
    pieChartData: [],
    totalIncome: 0,
    totalExpense: 0,
  });

  const getDataThuChi = async () => {
    setLoading(true);
    if (startDate && endDate) {
      try {
        const formattedStartDate = new Date(
          startDate.getTime() - startDate.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split("T")[0];
        const formattedEndDate = new Date(
          endDate.getTime() - endDate.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split("T")[0];

        const response = await axiosPrivate(
          `user/get-user-amount?userId=${user?.studentCode?._id}&startDate=${formattedStartDate}&endDate=${formattedEndDate}&userId=${user?.studentCode?._id}`
        );
        // Xử lý dữ liệu thu/chi cho biểu đồ tròn
        const history = response.data.data.history;
        const processedData = processDataForPieChart(history);

        setDataThuChi({
          pieChartData: processedData,
          totalIncome: processedData[0]?.population || 0,
          totalExpense: processedData[1]?.population || 0,
        });
      } catch (error) {
        console.error(error);
      }
    }
    setLoading(false);
  };

  // Hàm xử lý dữ liệu cho Pie Chart
  const processDataForPieChart = (history: any) => {
    const data = {
      income: 0,
      expense: 0,
    };

    history.forEach((transaction: any) => {
      if (transaction.amount > 0) {
        data.income += transaction.amount;
      } else {
        data.expense += Math.abs(transaction.amount); // Giá trị tuyệt đối cho chi tiêu
      }
    });

    return [
      {
        name: "Nạp vào",
        population: data.income,
        color: "#4CAF50",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      },
      {
        name: "Chi ra",
        population: data.expense,
        color: "#F44336",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      },
    ];
  };

  useEffect(() => {
    if (startDate && endDate) {
      getDataRead();
      getDataThuChi();
    }
  }, [startDate, endDate]);

  // Lọc những ngày có thời gian đọc > 0
  const filteredData = dataRead.labels
    .map((label: string, index: number) => ({
      label,
      readTime: dataRead.datasets[0]?.data[index] || 0,
    }))
    .filter((entry: any) => entry.readTime > 0);

  // Kiểm tra nếu có dữ liệu đọc
  const noData = !filteredData.length;
  // Tính thời gian đọc trung bình
  const averageReadTime = dataRead.averageReadTime || 0;

  // Biểu đồ thống kê thời gian đọc
  const chartData = {
    labels: filteredData.map((entry: any) => entry.label),
    datasets: [
      {
        data: filteredData.map((entry: any) => entry.readTime),
        color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
        strokeWidth: 4,
      },
    ],
  };
  const totalDays =
    startDate && endDate
      ? Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1
        )
      : 0;
  const chartConfig = {
    backgroundGradientFrom: "#f5f7fa",
    backgroundGradientTo: "#f5f7fa",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 0.5, // Tăng khoảng cách giữa các cột
    decimalPlaces: 0,
    propsForLabels: {
      fontSize: 12,
      fontWeight: "bold",
      fill: "#333",
    },
    propsForVerticalLabels: {
      rotation: 45,
      fontSize: 12,
      fontWeight: "bold",
      fill: "#4A90E2", // Màu cho nhãn dọc
    },
    propsForHorizontalLabels: {
      fontSize: 12,
      fontWeight: "bold",
      fill: "#8CBA51", // Màu cho nhãn ngang
    },
    fillShadowGradient: "#4A90E2",
    fillShadowGradientOpacity: 0.8,
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    propsForBackgroundLines: {
      stroke: "#e3e3e3",
      strokeDasharray: "5,5",
    },
  };
  const readingDays = filteredData.length;
  const readingRate =
    totalDays > 0 ? ((readingDays / totalDays) * 100).toFixed(2) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={26} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Thống kê cá nhân</Text>
      </View>
      <View style={styles.separator}></View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.chooseButton,
            { borderColor: isChoose === "read" ? "#E48641" : "gray" },
          ]}
          onPress={() => {
            setIsChoose("read");
            getDataRead();
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: isChoose === "read" ? "#E48641" : "gray",
            }}
          >
            Thời gian đọc
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.chooseButton,
            { borderColor: isChoose === "thuchi" ? "#E48641" : "gray" },
          ]}
          onPress={() => {
            setIsChoose("thuchi");
            getDataThuChi();
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: isChoose === "thuchi" ? "#E48641" : "gray",
            }}
          >
            Thu chi
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.datePickerContainer}>
        <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
          <Text style={styles.dateText}>
            Ngày bắt đầu:{" "}
            {startDate ? startDate.toLocaleDateString() : "Chưa chọn"}
          </Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartDatePicker(false);
              setStartDate(selectedDate || startDate);
              if (selectedDate && endDate && selectedDate > endDate) {
                setEndDate(selectedDate); // Điều chỉnh ngày kết thúc nếu cần
              }
            }}
          />
        )}

        <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
          <Text style={styles.dateText}>
            Ngày kết thúc:{" "}
            {endDate ? endDate.toLocaleDateString() : "Chưa chọn"}
          </Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowEndDatePicker(false);
              if (selectedDate && startDate && selectedDate >= startDate) {
                setEndDate(selectedDate);
              } else {
                setEndDate(startDate); // Ngăn ngày kết thúc sớm hơn ngày bắt đầu
              }
            }}
          />
        )}
      </View>

      {isChoose === "read" ? (
        noData ? (
          <Text style={styles.noDataText}>
            Không có dữ liệu trong khoảng thời gian này.
          </Text>
        ) : (
          <>
            <BarChart
              data={chartData}
              width={screenWidth * 0.95}
              height={300}
              yAxisLabel=""
              yAxisSuffix=" phút"
              chartConfig={chartConfig}
              fromZero
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
            <Text style={styles.averageText}>
              Thời gian đọc trung bình: {averageReadTime.toFixed(1)} phút trong
              vòng {totalDays} ngày
            </Text>
            <Text style={styles.averageText}>
              Tỉ lệ đọc sách hằng ngày: {readingRate}% (số ngày đọc:{" "}
              {readingDays}/{totalDays})
            </Text>
          </>
        )
      ) : dataThuChi.pieChartData.length == 0 ? (
        <Text style={styles.noDataText}>
          Không có dữ liệu trong khoảng thời gian này.
        </Text>
      ) : (
        <>
          <PieChart
            data={dataThuChi.pieChartData}
            width={screenWidth}
            height={220}
            chartConfig={{
              backgroundColor: "#f5f5f5",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            center={[10, 0]}
            absolute // Hiển thị số liệu bên trong biểu đồ
          />
          <Text style={styles.averageText}>
            Tổng tiền nạp vào trong vòng {totalDays} ngày:{" "}
            {dataThuChi.totalIncome.toLocaleString()} VND
          </Text>
          <Text style={styles.averageText}>
            Tổng chi ra trong vòng {totalDays} ngày: :{" "}
            {dataThuChi.totalExpense.toLocaleString()} VND
          </Text>
          {/* // tính toán số tiền còn lại, nếu số tiền còn lại > 0 thì hiển thị màu xanh, ngược lại hiển thị màu đỏ */}
          <Text
            style={[
              styles.averageText,
              {
                color: "#4CAF50",
              },
            ]}
          >
            Số tiền còn lại:{" "}
            {(
              dataThuChi.totalIncome - dataThuChi.totalExpense
            ).toLocaleString()}{" "}
            VND
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#E48641",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#ddd",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "92%",
    marginTop: 20,
  },
  chooseButton: {
    width: "48%",
    height: 50,
    borderRadius: 15,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  datePickerContainer: {
    width: "92%",
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 5,
  },
  goBackButton: {
    borderRadius: 20,
    marginRight: 10,
  },
  noDataText: {
    textAlign: "center",
    color: "gray",
    marginTop: 20,
    fontSize: 16,
  },
  averageText: {
    textAlign: "center",
    color: "#333",
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
  },
});
