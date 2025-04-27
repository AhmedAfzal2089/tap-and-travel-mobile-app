import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../theme/theme";

const AppDatePicker = ({
  label,
  value,
  onChange,
  placeholder = "Select date",
  format = "YYYY-MM-DD",
  variant = "primary",
  borderRadius = 10,
  error = "",
  style,
  ...props
}) => {
  const { theme } = useTheme();
  const borderColor = theme.colors[variant] || theme.colors.primary;

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    onChange(date);
    hideDatePicker();
  };

  return (
    <View style={style}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        onPress={showDatePicker}
        style={[styles.container, { borderColor, borderRadius }]}
      >
        <TextInput
          style={styles.input}
          value={value ? new Date(value).toISOString().split("T")[0] : ""}
          placeholder={placeholder}
          placeholderTextColor="gray"
          editable={false}
          {...props}
        />
        <Ionicons name="calendar" size={24} color="gray" style={styles.icon} />
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "black",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "black",
  },
  icon: {
    marginLeft: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});

export default AppDatePicker;
