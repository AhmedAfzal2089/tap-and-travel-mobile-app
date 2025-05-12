import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import AppButton from "../../Components/Button";
import AppInput from "../../Components/AppInput";
import Toast from "react-native-toast-message";
import apiClient from "../../api/apiClient";

const passwordRules = [
  { label: "Minimum 8 characters", test: (val) => val.length >= 8 },
  { label: "At least one capital letter", test: (val) => /[A-Z]/.test(val) },
  { label: "At least one number", test: (val) => /\d/.test(val) },
  {
    label: "At least one special character",
    test: (val) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
  },
];

const ResetPassword = ({ navigation, route }) => {
  const { email, secret_key } = route?.params || {};
  const [state, setState] = useState({
    password: "",
    confirmPassword: "",
    isLoading: false,
    isPasswordVisible: false,
    isConfirmPasswordVisible: false,
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    general: "",
  });

  const [validationResults, setValidationResults] = useState({
    rulesStatus: passwordRules.map(rule => ({ ...rule, valid: false })),
    passwordsMatch: false,
  });

  useEffect(() => {
    if (!email || !secret_key) {
      Toast.show({
        type: "error",
        text1: "Invalid Request",
        text2: "Missing required information to reset password"
      });
      navigation.replace("ForgotEmail");
    }
  }, [email, secret_key]);

  const updateState = (data) => setState(prev => ({ ...prev, ...data }));

  // Validate password against rules and update validation state
  useEffect(() => {
    const rulesStatus = passwordRules.map(rule => ({
      ...rule,
      valid: rule.test(state.password),
    }));

    const passwordsMatch = state.confirmPassword.length > 0 && 
      state.password === state.confirmPassword;

    setValidationResults({
      rulesStatus,
      passwordsMatch,
    });

    // Update error messages
    let passwordError = "";
    if (state.password && !rulesStatus.every(rule => rule.valid)) {
      passwordError = "Password does not meet all requirements";
    }

    let confirmError = "";
    if (state.confirmPassword && !passwordsMatch) {
      confirmError = "Passwords do not match";
    }

    setErrors(prev => ({ 
      ...prev, 
      password: passwordError,
      confirmPassword: confirmError 
    }));
  }, [state.password, state.confirmPassword]);

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      updateState({ isPasswordVisible: !state.isPasswordVisible });
    } else {
      updateState({ isConfirmPasswordVisible: !state.isConfirmPasswordVisible });
    }
  };

  const validateForm = () => {
    // Check if all rules are valid
    const isPasswordValid = validationResults.rulesStatus.every(rule => rule.valid);
    const passwordsMatch = state.password === state.confirmPassword;

    let formErrors = {
      password: "",
      confirmPassword: "",
      general: "",
    };

    if (!state.password) {
      formErrors.password = "Password is required";
    } else if (!isPasswordValid) {
      formErrors.password = "Password does not meet all requirements";
    }

    if (!state.confirmPassword) {
      formErrors.confirmPassword = "Please confirm your password";
    } else if (!passwordsMatch) {
      formErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(formErrors);

    return isPasswordValid && passwordsMatch && state.password.length > 0 && 
      state.confirmPassword.length > 0;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fix the errors before submitting"
      });
      return;
    }

    updateState({ isLoading: true });
    
    try {
      const response = await apiClient.post("/user/forgot-password/reset", {
        email,
        secret_key,
        newPassword: state.password,
      });

      Toast.show({
        type: "success",
        text1: "Success!",
        text2: response?.data?.message || "Password reset successfully!"
      });
      navigation.replace("Login");
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 
        "Failed to reset password. Please try again.";
      
      // Check for specific error types
      if (error?.response?.status === 400) {
        setErrors(prev => ({ ...prev, general: "Invalid request parameters" }));
      } else if (error?.response?.status === 401) {
        setErrors(prev => ({ ...prev, general: "Reset link has expired" }));
      } else {
        setErrors(prev => ({ ...prev, general: errorMessage }));
      }
      
      Toast.show({
        type: "error",
        text1: "Password Reset Failed",
        text2: errorMessage
      });
    } finally {
      updateState({ isLoading: false });
    }
  };

  const isFormValid = validationResults.rulesStatus.every(rule => rule.valid) && 
    validationResults.passwordsMatch && 
    state.password.length > 0 && 
    state.confirmPassword.length > 0;

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
          <Animatable.View animation="fadeInDown" duration={800}>
            <MaterialIcons name="location-on" size={64} color="white" />
            <Text style={styles.appName}>Tap And Travel</Text>
          </Animatable.View>
        </LinearGradient>

        <Animatable.View
          animation="fadeInUp"
          duration={800}
          delay={200}
          style={styles.bottomSection}
        >
          <Text style={styles.title}>Reset Your Password</Text>
          
          {errors.general ? (
            <View style={styles.generalErrorContainer}>
              <Text style={styles.generalErrorText}>{errors.general}</Text>
            </View>
          ) : null}

          <AppInput
            placeholder="New Password"
            secureTextEntry={!state.isPasswordVisible}
            value={state.password}
            onChangeText={(password) => updateState({ password })}
            rightIcon={state.isPasswordVisible ? "eye" : "eye-off"}
            onRightIconPress={() => togglePasswordVisibility('password')}
            error={errors.password}
          />

          <AppInput
            placeholder="Confirm Password"
            secureTextEntry={!state.isConfirmPasswordVisible}
            value={state.confirmPassword}
            onChangeText={(confirmPassword) => updateState({ confirmPassword })}
            rightIcon={state.isConfirmPasswordVisible ? "eye" : "eye-off"}
            onRightIconPress={() => togglePasswordVisibility('confirmPassword')}
            error={errors.confirmPassword}
          />

          <View style={styles.rulesContainer}>
            <Text style={styles.rulesTitle}>Password must have:</Text>
            {validationResults.rulesStatus.map((rule, index) => (
              <View key={index} style={styles.ruleRow}>
                <Feather 
                  name={rule.valid ? "check-circle" : "circle"} 
                  size={16} 
                  color={rule.valid ? "green" : "#888"} 
                  style={styles.ruleIcon}
                />
                <Text
                  style={[
                    styles.ruleText, 
                    { color: rule.valid ? "green" : "#888" }
                  ]}
                >
                  {rule.label}
                </Text>
              </View>
            ))}
            {state.confirmPassword.length > 0 && (
              <View style={styles.ruleRow}>
                <Feather 
                  name={validationResults.passwordsMatch ? "check-circle" : "circle"} 
                  size={16} 
                  color={validationResults.passwordsMatch ? "green" : "#888"} 
                  style={styles.ruleIcon}
                />
                <Text
                  style={[
                    styles.ruleText,
                    { color: validationResults.passwordsMatch ? "green" : "#888" }
                  ]}
                >
                  Passwords match
                </Text>
              </View>
            )}
          </View>

          <AppButton
            text="Reset Password"
            onPress={handleResetPassword}
            variant="primary"
            isLoading={state.isLoading}
            disabled={!isFormValid}
          />

          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>Remember your password? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetPassword;

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
    marginTop: 10,
    textAlign: "center",
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#292966",
    marginBottom: 20,
    textAlign: "center",
  },
  rulesContainer: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  rulesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  ruleIcon: {
    marginRight: 8,
  },
  ruleText: {
    fontSize: 14,
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#999",
    fontSize: 14,
  },
  loginLink: {
    color: "#ff4d4d",
    fontWeight: "bold",
    fontSize: 14,
  },
  generalErrorContainer: {
    backgroundColor: "#ffeeee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ffcccc",
  },
  generalErrorText: {
    color: "#d32f2f",
    fontSize: 14,
  },
});