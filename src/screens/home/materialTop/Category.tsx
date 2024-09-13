import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import axiosPrivate from "../../../api/axiosPrivate";
import CategoryItem from "../../../components/CategoryItem";

export default function Category({ navigation }: any) {
  const [categories, setCategories] = useState([]);

  async function GetCategories() {
    try {
      const res = await axiosPrivate.get("admin/get-all-category");
      setCategories(res.data.data);
    } catch (e) {
      console.error("Error fetching categories:", e);
    }
  }

  useEffect(() => {
    GetCategories();
  }, []);

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
    <LinearGradient colors={["#F3EAC1", "#E0F7F4"]} style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      </View>
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
