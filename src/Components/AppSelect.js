import React from "react";
import { View, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useTheme } from "../theme/theme";
import Ionicons from "react-native-vector-icons/Ionicons";

const AppSelect = ({
  items,
  onValueChange,
  placeholder,
  variant = "primary",
  style,
}) => {
  const { theme } = useTheme();
  const borderColor = theme.colors[variant] || theme.colors.primary;
  const text = placeholder || "Select an option";

  return (
    <View style={[styles.container, { borderColor }, style]}>
      <RNPickerSelect
        onValueChange={onValueChange}
        items={items}
        style={pickerSelectStyles}
        placeholder={{ label: text, value: null }}
        useNativeAndroidPickerStyle={false}
        Icon={() => <Ionicons name="chevron-down" size={20} color="gray" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 10,
    marginVertical: 8,
  },
});

const pickerSelectStyles = {
  inputIOS: { fontSize: 16, color: "black" },
  inputAndroid: { fontSize: 16, color: "black" },
  iconContainer: {
    // Adjusts the custom icon position
    top: 12,
    right: 10,
  },
};

export default AppSelect;
