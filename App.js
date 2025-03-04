import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Routes from "./src/Navigations/Route";
import FlashMessage from "react-native-flash-message";
import { Provider } from "react-redux";
import store from "./src/store/store";

export default function App() {
  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <Routes />
        <FlashMessage position="top" />
      </View>
    </Provider>
  );
}
