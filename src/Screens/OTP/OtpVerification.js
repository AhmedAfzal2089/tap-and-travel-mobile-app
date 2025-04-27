import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import AppButton from "../../Components/Button";
import { showError, showSuccess } from "../../utils/helperFunction";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../../api/apiClient";
import Toast from "react-native-toast-message";

const OtpVerification = ({ route }) => {
    const navigation = useNavigation();
    const { email } = route.params;
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);

    useEffect(() => {
        let timer;
        if (resendTimer > 0) {
            timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendTimer]);

    const onVerifyOtp = async () => {
        if (otp.length !== 6) {
            Toast.show({
                type: "error",
                text1: "Enter 6 digit Otp !",
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await apiClient.post("/user/verify-otp", { email, otp });

            if (response.data) {
                Toast.show({
                    type: "success",
                    text1: "Otp Verified, Login to Continue !",
                });
                navigation.navigate("Login"); // Navigate to home screen after verification
            }
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Otp Verification Failed",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onResendOtp = async () => {
        if (resendTimer > 0) return;

        try {
            await apiClient.post("/user/resend-otp", { email });
            Toast.show({
                type: "success",
                text1: "Otp Resent!",
            });
            setResendTimer(30);
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Failed to resend Otp!",
            });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>OTP Verification</Text>
            <Text style={styles.subtitle}>Enter the OTP sent to {email}</Text>

            <TextInput
                style={styles.otpInput}
                placeholder="Enter OTP"
                keyboardType="numeric"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
            />

            <AppButton text="Verify OTP" onPress={onVerifyOtp} isLoading={isLoading} />

            <TouchableOpacity onPress={onResendOtp} disabled={resendTimer > 0}>
                <Text style={[styles.resendText, resendTimer > 0 && styles.disabledText]}>
                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: "white",
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
        color: "gray",
    },
    otpInput: {
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 8,
        fontSize: 20,
        textAlign: "center",
        padding: 12,
        marginBottom: 20,
    },
    resendText: {
        textAlign: "center",
        fontSize: 16,
        color: "blue",
        marginTop: 15,
    },
    disabledText: {
        color: "gray",
    },
});

export default OtpVerification;
