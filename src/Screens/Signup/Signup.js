import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AppInput from "../../Components/AppInput";
import AppButton from "../../Components/Button";
import apiClient from "../../api/apiClient";
import Toast from "react-native-toast-message";

const Signup = ({ navigation }) => {
  const [state, setState] = useState({
    isLoading: false,
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    isSecure: true,
    isSecureConfirm: true,
  });

  const updateState = (data) => setState((prev) => ({ ...prev, ...data }));

  const togglePasswordVisibility = () => {
    updateState({ isSecure: !state.isSecure });
  };

  const toggleConfirmPasswordVisibility = () => {
    updateState({ isSecureConfirm: !state.isSecureConfirm });
  };

  const isValidData = () => {
    if (!state.name || !state.email || !state.password || !state.phoneNumber) {
      Toast.show({
        type: "error",
        text1: "All fields are required!",
      });
      return false;
    }
    if (state.password !== state.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Passwords doesn't match!",
      });
      return false;
    }
    return true;
  };

  const onSignUp = async () => {
    if (!isValidData()) return;

    updateState({ isLoading: true });

    try {
      const response = await apiClient.post("/user/register", {
        name: state.name,
        email: state.email,
        password: state.password,
        phoneNumber: state.phoneNumber,
      });

      if (response.data) {
        Toast.show({
          type: "success",
          text1: "Otp sent to your email",
        });
        navigation.navigate("OtpVerification", { email: state.email });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "SignUp Failed!",
      });
    } finally {
      updateState({ isLoading: false });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        {/* Location Icon and App Title */}
        <MaterialIcons
          name="location-on"
          size={60}
          color="white"
          style={{ marginBottom: 10 }}
        />
        <Text style={styles.appName}>Tap And Travel</Text>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.welcomeText}>Create Account</Text>

        <AppInput
          placeholder="Full Name"
          value={state.name}
          onChangeText={(name) => updateState({ name })}
        />
        <AppInput
          placeholder="Email"
          value={state.email}
          keyboardType="email-address"
          onChangeText={(email) => updateState({ email })}
        />
        <AppInput
          placeholder="Phone Number"
          value={state.phoneNumber}
          keyboardType="phone-pad"
          onChangeText={(phoneNumber) => updateState({ phoneNumber })}
        />
        <AppInput
          placeholder="Password"
          secureTextEntry={state.isSecure}
          value={state.password}
          onChangeText={(password) => updateState({ password })}
          rightIcon={state.isSecure ? "eye-off" : "eye"}
          onRightIconPress={togglePasswordVisibility}
        />
        <AppInput
          placeholder="Confirm Password"
          secureTextEntry={state.isSecureConfirm}
          value={state.confirmPassword}
          onChangeText={(confirmPassword) => updateState({ confirmPassword })}
          rightIcon={state.isSecureConfirm ? "eye-off" : "eye"}
          onRightIconPress={toggleConfirmPasswordVisibility}
        />

        <View style={{ marginVertical: 6 }} />
        <AppButton
          text="Sign Up"
          onPress={onSignUp}
          isLoading={state.isLoading}
          variant="primary"
        />

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text style={styles.registerNow}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#292966",
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
    marginBottom: 16,
  },
  loginText: {
    textAlign: "center",
    marignTop: 15,
    marginBottom: 40,
    fontSize: 16,
    color: "#999",
  },
  registerNow: {
    color: "red",
    fontWeight: "bold",
  },
});

export default Signup;
