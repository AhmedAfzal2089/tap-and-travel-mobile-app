import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
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

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const updateState = (data) => setState((prev) => ({ ...prev, ...data }));

  const togglePasswordVisibility = () => {
    updateState({ isSecure: !state.isSecure });
  };

  const toggleConfirmPasswordVisibility = () => {
    updateState({ isSecureConfirm: !state.isSecureConfirm });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const validatePhoneNumber = (phone) => {
    // Basic phone validation (adjust based on your requirements)
    const phoneRegex = /^\d{10,15}$/;
    return phoneRegex.test(phone);
  };

  const validateField = (field, value) => {
    let errorMessage = "";

    switch (field) {
      case "name":
        if (!value.trim()) {
          errorMessage = "Name is required";
        } else if (value.trim().length < 3) {
          errorMessage = "Name must be at least 3 characters";
        }
        break;

      case "email":
        if (!value.trim()) {
          errorMessage = "Email is required";
        } else if (!validateEmail(value)) {
          errorMessage = "Please enter a valid email address";
        }
        break;

      case "password":
        if (!value) {
          errorMessage = "Password is required";
        } else if (!validatePassword(value)) {
          errorMessage = "Password must be at least 8 characters with uppercase, lowercase, and number";
        }
        break;

      case "confirmPassword":
        if (!value) {
          errorMessage = "Please confirm your password";
        } else if (value !== state.password) {
          errorMessage = "Passwords don't match";
        }
        break;

      case "phoneNumber":
        if (!value.trim()) {
          errorMessage = "Phone number is required";
        } else if (!validatePhoneNumber(value)) {
          errorMessage = "Please enter a valid phone number";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: errorMessage }));
    return !errorMessage;
  };

  const handleInputChange = (field, value) => {
    updateState({ [field]: value });
    validateField(field, value);
  };

  const validateAllFields = () => {
    const fields = ["name", "email", "password", "confirmPassword", "phoneNumber"];
    let isValid = true;

    fields.forEach((field) => {
      const fieldIsValid = validateField(field, state[field]);
      if (!fieldIsValid) isValid = false;
    });

    return isValid;
  };

  const onSignUp = async () => {
    if (!validateAllFields()) {
      Toast.show({ 
        type: "error", 
        text1: "Please fix the errors", 
        text2: "Check the form for validation errors"
      });
      return;
    }

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
          text1: "Success!", 
          text2: "OTP sent to your email" 
        });
        navigation.navigate("OtpVerification", { email: state.email });
      }
    } catch (error) {
      let errorMessage = "Sign up failed. Please try again.";
      
      // Handle specific error responses from the API
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = "This email is already registered";
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      Toast.show({ 
        type: "error", 
        text1: "Registration Failed", 
        text2: errorMessage 
      });
    } finally {
      updateState({ isLoading: false });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <LinearGradient
          colors={["#4c669f", "#3b5998", "#192f6a"]}
          style={styles.topSection}
        >
          <Animatable.View animation="fadeInDown" duration={800} delay={200}>
            <MaterialIcons name="location-on" size={64} color="white" />
            <Text style={styles.appName}>Tap And Travel</Text>
          </Animatable.View>
        </LinearGradient>

        <Animatable.View
          animation="fadeInUp"
          duration={800}
          delay={300}
          style={styles.bottomSection}
        >
          <Text style={styles.welcomeText}>Create Account</Text>

          <AppInput
            placeholder="Full Name"
            value={state.name}
            onChangeText={(value) => handleInputChange("name", value)}
            error={errors.name}
          />
          <AppInput
            placeholder="Email"
            value={state.email}
            keyboardType="email-address"
            onChangeText={(value) => handleInputChange("email", value)}
            error={errors.email}
          />
          <AppInput
            placeholder="Phone Number"
            value={state.phoneNumber}
            keyboardType="phone-pad"
            onChangeText={(value) => handleInputChange("phoneNumber", value)}
            error={errors.phoneNumber}
          />
          <AppInput
            placeholder="Password"
            secureTextEntry={state.isSecure}
            value={state.password}
            onChangeText={(value) => handleInputChange("password", value)}
            rightIcon={state.isSecure ? "eye-off" : "eye"}
            onRightIconPress={togglePasswordVisibility}
            error={errors.password}
          />
          <AppInput
            placeholder="Confirm Password"
            secureTextEntry={state.isSecureConfirm}
            value={state.confirmPassword}
            onChangeText={(value) => handleInputChange("confirmPassword", value)}
            rightIcon={state.isSecureConfirm ? "eye-off" : "eye"}
            onRightIconPress={toggleConfirmPasswordVisibility}
            error={errors.confirmPassword}
          />

          <View style={{ marginVertical: 16 }} />
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
        </Animatable.View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingVertical: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  appName: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
  },
  bottomSection: {
    flex: 2,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 36,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#292966",
    marginBottom: 20,
  },
  loginText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  registerNow: {
    color: "#ff4d4d",
    fontWeight: "bold",
  },
});

export default Signup;
