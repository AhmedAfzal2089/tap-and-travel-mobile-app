import React, { useContext, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import validator from "../../utils/validation";
import { showError } from "../../utils/helperFunction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOGIN } from "../../config/urls";
import { AuthContext } from "../../context/AuthContext";
import Toast from "react-native-toast-message";
import AppButton from "../../Components/Button";
import AppInput from "../../Components/AppInput";

export const loginUser = async (userData) => {
  try {
    const response = await fetch(LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok && data.token) {
      await AsyncStorage.setItem("token", data.token);
      return { success: true, data };
    } else {
      return { success: false, message: data.message || "Login failed" };
    }
  } catch (err) {
    return { success: false, message: err.message || "Unexpected error" };
  }
};

const Login = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [state, setState] = useState({
    isLoading: false,
    email: "",
    password: "",
    isSecure: true,
  });

  const { isLoading, email, password, isSecure } = state;

  const updateState = (data) => setState((prev) => ({ ...prev, ...data }));

  const isValidData = () => {
    const error = validator({ email, password });
    if (error) {
      showError(error);
      return false;
    }
    return true;
  };

  const onLogin = async () => {
    if (!isValidData()) {
      return;
    }

    updateState({ isLoading: true });

    const response = await loginUser({ email, password });

    if (response.success) {
      await login(response.data.token);
    } else {
      Toast.show({
        type: "error",
        text1: "Invalid email or password!",
      });
    }

    updateState({ isLoading: false });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        {/* Location Icon */}
        <MaterialIcons
          name="location-on"
          size={60}
          color="white"
          style={{ marginBottom: 10 }}
        />
        {/* Title */}
        <Text style={styles.appName}>Tap And Travel</Text>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.welcomeText}>Welcome</Text>
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.registerNow}>Register now</Text>
          </TouchableOpacity>
        </View>

        <AppInput
          placeholder="Enter your email"
          value={email}
          onChangeText={(email) => updateState({ email })}
        />
        <AppInput
          placeholder="Enter your password"
          value={password}
          secureTextEntry={isSecure}
          onChangeText={(password) => updateState({ password })}
        />

        <View style={{ marginVertical: 12 }} />
        <AppButton
          text="Login"
          onPress={onLogin}
          variant="primary"
          isLoading={isLoading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#292966", // Updated dark background
  },
  topSection: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  appName: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  bottomSection: {
    flex: 2,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#292966",
    marginBottom: 8,
  },
  registerRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  registerText: {
    color: "#999",
  },
  registerNow: {
    color: "red",
    fontWeight: "bold",
  },
});

export default Login;
