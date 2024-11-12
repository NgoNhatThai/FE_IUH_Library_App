import axios from "axios";
import axiosRetry from "axios-retry";
import { REACT_APP_API_URL } from "@env";
// import {auth} from '../config/firebase';
import queryString from "query-string";
import AsyncStorage from "@react-native-async-storage/async-storage";
// const BASE_URL = REACT_APP_API_URL || "http://localhost:5500/api";
const BASE_URL = REACT_APP_API_URL;
console.log("o5aaâs ", BASE_URL);
const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  paramsSerializer: (params) => queryString.stringify(params),
});
axiosPrivate.defaults.withCredentials = true;

axiosPrivate.interceptors.request.use(
  async (config) => {
    // Do something before request is sent
    // console.log(BASE_URL)
    // console.log(auth.currentUser)
    const token = (await AsyncStorage.getItem("token")) || "";
    // console.log("token", token);
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// axiosPrivate.interceptors.response.use(
//     (response) => {
//         // Do something with response data
//         return response.data;
//     },
//     async (error) => {
//         return Promise.reject(error);
//     }
// );

// axiosRetry(axiosPrivate, {
//     retries: 2, // number of retries
//     retryDelay: (retryCount) => {
//         console.log(`retry attempt: ${retryCount}`);
//         return retryCount * 1000; // time interval between retries
//     },
//     retryCondition: (error) => {
//         return (
//             error.response?.status === 401
//         );
//     },
// });

export default axiosPrivate;
