import React, { useEffect, useState } from "react";
import { Modal, View, Text, StyleSheet } from "react-native";

import AppSelect from "../../Components/AppSelect";
import AppInput from "../../Components/AppInput";
import { pakistanCities } from "../../utils/pakistanCities";
import AppButton from "../../Components/Button";

const RFIDOrderModal = ({ visible, onClose, onSubmit, initialAddress }) => {
  const [formData, setFormData] = useState({
    province: "",
    city: "",
    postalCode: "",
    address: "",
  });

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const uniqueProvinces = [
      ...new Set(Object.values(pakistanCities).map((city) => city.province)),
    ];
    setProvinces(uniqueProvinces);

    if (initialAddress) {
      setFormData(initialAddress);
      const citiesInProvince = Object.values(pakistanCities)
        .filter((city) => city.province === initialAddress.province)
        .map((city) => city.name);
      setCities(citiesInProvince);
    }
  }, []);

  const handleProvinceChange = (selectedProvince) => {
    const filteredCities = Object.values(pakistanCities)
      .filter((city) => city.province === selectedProvince)
      .map((city) => city.name);

    setFormData((prev) => ({
      ...prev,
      province: selectedProvince,
      city: "",
    }));
    setCities(filteredCities);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Enter Your Address</Text>

          <AppSelect
            items={provinces.map((province) => ({
              label: province,
              value: province,
            }))}
            placeholder="Select Province"
            onValueChange={handleProvinceChange}
            variant="secondary"
          />

          <AppSelect
            items={cities.map((city) => ({
              label: city,
              value: city,
            }))}
            placeholder="Select City"
            onValueChange={(value) => handleChange("city", value)}
            variant="secondary"
          />

          <AppInput
            placeholder="Postal Code"
            value={formData.postalCode}
            onChangeText={(value) => handleChange("postalCode", value)}
            keyboardType="numeric"
            variant="secondary"
          />

          <AppInput
            placeholder="Full Address"
            value={formData.address}
            onChangeText={(value) => handleChange("address", value)}
            variant="secondary"
          />

          <View style={styles.buttonRow}>
            <AppButton
              text="Cancel"
              onPress={onClose}
              variant="secondary"
              style={styles.buttonSpacing}
            />
            <AppButton
              text="Submit"
              onPress={handleSubmit}
              variant="primary"
              style={styles.buttonSpacing}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RFIDOrderModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    width: "90%",
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  buttonSpacing: {
    flex: 1,
    marginHorizontal: 5,
  },
});
