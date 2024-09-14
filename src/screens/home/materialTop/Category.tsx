import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import axiosPrivate from "../../../api/axiosPrivate";
import CategoryItem from "../../../components/CategoryItem";
import { useFocusEffect } from "@react-navigation/native";

export default function Category({ navigation }: any) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  async function GetCategories() {
    setLoading(true);
    try {
      const res = await axiosPrivate.get("admin/get-all-category");
      setCategories(res.data.data);
    } catch (e) {
      console.error("Error fetching categories:", e);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      GetCategories();
    }, [])
  );
  const renderItem = ({ item }: { item: any }) => (
    <CategoryItem
      name={item?.name}
      image={item?.image}
      onPress={() => {
        navigation.navigate("CatergoryDetail", { item: item });
      }}
    />
  );

  return (
    <LinearGradient
      colors={["#F3EAC1", "#E0F7F4"]}
      style={{ flex: 1, justifyContent: "center" }}
    >
      {loading ? (
        // Show loading spinner when data is being fetched
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.container}>
          <FlatList
            data={categories}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            numColumns={2}
            contentContainerStyle={styles.list}
          />
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  list: {
    justifyContent: "space-between",
  },
});
