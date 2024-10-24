import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosPrivate from "../api/axiosPrivate";
interface User {
  studentCode: {
    __v: number;
    _id: string;
    avatar: string;
    createdAt: string;
    memberShip: string;
    password: string;
    refresh_token: string;
    status: string;
    studentCode: number;
    updatedAt: string;
    userName: string;
  };
}

type AuthContextType = {
  user: User | null;
  config: any;
  login: ({ userData, token }: { userData: any; token: any }) => void;
  logout: () => void;
  history?: History[] | undefined;
  addHistory: (newHistory: History) => void;
  token: string | null;
  keySearch: KeySearch[];
  addKeySearch: (newKeySearch: KeySearch) => void;
};
type History = {
  bookId: string;
  image: string;
  title: string;
  currentPage: number;
  percent: number;
};
type AuthProviderProps = {
  children: ReactNode;
};
type KeySearch = {
  key: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [config, setConfig] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [history, setHistory] = useState<History[]>([]);
  const [keySearch, setKeySearch] = useState<KeySearch[]>([]);
  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        const configg = await axiosPrivate.get("admin/get-config");
        const token = await AsyncStorage.getItem("token");
        const configData = await AsyncStorage.getItem("config");
        const historyData = await AsyncStorage.getItem("history");
        const keySearchData = await AsyncStorage.getItem("keySearch");
        console.log(
          "userData",
          userData,
          "configData",
          configData,
          "token",
          token,
          "historyData",
          historyData,
          "keySearchData",
          keySearchData
        );
        if (userData) {
          setUser(JSON.parse(userData));
        }
        if (configg) {
          setConfig(configg?.data?.data);
        }
        if (historyData) {
          setHistory(JSON.parse(historyData));
        }
        if (token) {
          setToken(token);
        }
        if (keySearchData) {
          setKeySearch(JSON.parse(keySearchData));
        }
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };

    loadData();
  }, []);

  const login = async ({ userData, token }: { userData: any; token: any }) => {
    try {
      const tokena = JSON.stringify(token);
      const cleanedToken = tokena.slice(1, -1);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      await AsyncStorage.setItem("token", cleanedToken);

      setUser(userData);
      setToken(cleanedToken);
    } catch (error) {
      console.error("Failed to  save data", error);
    }
  };
  const addHistory = async (newHistory: History) => {
    try {
      const existingBookIndex = history.findIndex(
        (item: History) => item.bookId === newHistory.bookId
      );

      let updatedHistory: History[] = [];

      if (existingBookIndex !== -1) {
        // Nếu sách đã có trong history, cập nhật currentPage và percent
        updatedHistory = history.map((item: History, index: number) =>
          index === existingBookIndex
            ? {
                ...item,
                currentPage: newHistory.currentPage,
                percent: newHistory.percent,
              }
            : item
        );
      } else {
        // Nếu sách chưa có, thêm mới vào history
        updatedHistory = [newHistory, ...history];
      }

      // Cập nhật lại history và lưu vào AsyncStorage
      await AsyncStorage.setItem("history", JSON.stringify(updatedHistory));

      setHistory(updatedHistory);
    } catch (error) {
      console.error("Failed to update history", error);
    }
  };
  const addKeySearch = async (newKeySearch: KeySearch) => {
    if (newKeySearch.key === "") return;
    const existingIndex = keySearch.findIndex(
      (item) => item.key === newKeySearch.key
    );

    // Nếu tìm thấy từ khóa, xóa phần tử cũ và thêm nó lên đầu mảng
    let updatedKeySearch;
    if (existingIndex !== -1) {
      // Xóa phần tử đã tồn tại
      keySearch.splice(existingIndex, 1);
      updatedKeySearch = [newKeySearch, ...keySearch];
    } else {
      // Nếu chưa có từ khóa, thêm từ khóa mới lên đầu mảng
      updatedKeySearch = [newKeySearch, ...keySearch];
    }

    try {
      await AsyncStorage.setItem("keySearch", JSON.stringify(updatedKeySearch));
      setKeySearch(updatedKeySearch);
    } catch (error) {
      console.error("Failed to update keySearch", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      // await AsyncStorage.removeItem("config");
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("history");
      await AsyncStorage.removeItem("keySearch");
      setKeySearch([]);
      setHistory([]);

      setUser(null);
      // setConfig(null);
      setToken(null);
    } catch (error) {
      console.error("Failed to remove data", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        config,
        login,
        logout,
        addHistory,
        history,
        token,
        keySearch,
        addKeySearch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
