import React, { useState, useEffect } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import Routes from "./src/Navigations/Route";
import FlashMessage from "react-native-flash-message";
import { Provider } from "react-redux";
import store from "./src/store/store";
import { AuthProvider } from "./src/context/AuthContext";
import { StripeProvider } from "@stripe/stripe-react-native";
import Toast from "react-native-toast-message";
import { ThemeProvider } from "./src/theme/theme";

// 🔹 Splash Screen Component
const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    setTimeout(() => {
      onFinish();
    }, 2000); // Show splash for 2 seconds
  }, []);

  return (
    <View style={styles.splashContainer}>
      <Image source={require("./assets/logo.png")} style={styles.logo} />
      <Text style={styles.splashText}>Tap&Travel</Text>
    </View>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return isLoading ? (
    <SplashScreen onFinish={() => setIsLoading(false)} />
  ) : (
    <StripeProvider publishableKey="pk_test_51QMkUFKzfMgYIpCx3iDEwl4GbcNYQyEwhJKqGsc8BAuQ8h7pHFJqjhGR6LfImDlOojLfiV0DngTdZv1OBiv3w8c500a980IyyP">
      <Provider store={store}>
        <AuthProvider>
          <ThemeProvider>
            <View style={{ flex: 1 }}>
              <Routes />
              <Toast />
              <FlashMessage position="top" />
            </View>
          </ThemeProvider>
        </AuthProvider>
      </Provider>
    </StripeProvider>
  );
}

// 🔹 Styles for Splash Screen
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  splashText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});
