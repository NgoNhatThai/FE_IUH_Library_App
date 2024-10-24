import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTab from "./BottomTab";
import {
  BookDetails,
  BookReader,
  CatergoryDetail,
  SignIn,
  SignUp,
  RecentlyDetail,
  SuggestDetail,
  Wallet,
  Deposit,
} from "../screens/index";
const Stack = createNativeStackNavigator();
import ChapterPage from "../components/ChapterPage";
const HomeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={BottomTab} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="BookDetails" component={BookDetails} />
      <Stack.Screen name="BookReader" component={BookReader} />
      <Stack.Screen name="ChapterPage" component={ChapterPage} />
      <Stack.Screen name="CatergoryDetail" component={CatergoryDetail} />
      <Stack.Screen name="RecentlyDetail" component={RecentlyDetail} />
      <Stack.Screen name="SuggestDetail" component={SuggestDetail} />
      <Stack.Screen name="Wallet" component={Wallet} />
      <Stack.Screen name="Deposit" component={Deposit} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
