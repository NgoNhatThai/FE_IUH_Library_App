import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
const { width, height } = Dimensions.get("window");
import Icon from "react-native-vector-icons/Ionicons"; 
// tạo cho tôi 
type TaskBar = {
    isShowModal: boolean;
    setIsShowModal: (isShowModal: boolean) => void;

}
const TaskBar = ({ isShowModal, setIsShowModal
}:TaskBar ) => {
  const handlePress = () => {
    setIsShowModal(!isShowModal);
  };
  
  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={{ width }}>
        { && (
          <View style={[styles.modal, styles.modalTop]}>
            <TouchableOpacity
              style={{ position: "absolute", left: 10, top: 10, padding: 10 }}
              onPress={() => {
                navigation.navigate("BookDetails", { bookId: id });
              }}
            >
              <Icon name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            {type == "VOICE" && (
              <TouchableOpacity
                onPress={() => {
                  playSound(chapter?.mp3s[imageIndex]);
                }}
              >
                <FontAwesome6 name="headphones-simple" size={24} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
export default TaskBar;
const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    // backgroundColor: "#111111",
    borderColor: "black",
    borderWidth: 1,
    zIndex: 1000,
  },
  modalTop: {
    top: 0,
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
