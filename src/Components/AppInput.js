import React from "react";
import { useTheme } from "../theme/theme";
import { TextInput, View, Text, StyleSheet } from "react-native";

const AppInput = ({
  placeholder = "Enter text",
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  variant = "primary", // Theme-based colors
  borderRadius = 10,
  error = "",
  style,
  ...props
}) => {
  const { theme } = useTheme();
  const borderColor = theme.colors[variant] || theme.colors.primary;

  return (
    <View style={[styles.container, { borderColor, borderRadius }, style]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="gray"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 0,
    marginVertical: 8,
  },
  input: {
    fontSize: 16,
    color: "black",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});

export default AppInput;
