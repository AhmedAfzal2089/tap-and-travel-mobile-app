import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";
import { apiBaseUrl } from "../../config/urls";
import { useNavigation } from "@react-navigation/native";
import AppSelect from "../../Components/AppSelect";
import AppDatePicker from "../../Components/AppDatePicker";
import AppButton from "../../Components/Button";
import BusCard from "./BusCard";

const BookingForm = () => {
  const navigation = useNavigation();
  const [hasSearched, setHasSearched] = useState(false);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    fromCity: "",
    toCity: "",
    date: "",
  });

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiBaseUrl}/bus`);
      const today = new Date().toISOString().split("T")[0];
      const filteredData = response.data.filter((bus) => {
        const busDate = new Date(bus.date).toISOString().split("T")[0];
        return busDate >= today;
      });
      setBuses(filteredData);
      extractCities(filteredData);
    } catch (error) {
      console.error("Error fetching buses:", error);
    }
    setLoading(false);
  };

  const extractCities = (busesData) => {
    const citySet = new Set();
    busesData.forEach((bus) => {
      citySet.add(bus.route.startCity);
      citySet.add(bus.route.endCity);
    });
    setCities([...citySet]);
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const onDateChange = (selectedDate) => {
    if (!selectedDate) return;
    const formattedDate = new Date(selectedDate).toISOString().split("T")[0];
    setFormData({ ...formData, date: formattedDate });
  };

  const filterBuses = () => {
    const { fromCity, toCity, date } = formData;
    const selectedDate = date
      ? new Date(date).toISOString().split("T")[0]
      : null;
    if (!selectedDate) {
      console.error("Invalid date selected");
      return;
    }
    const results = buses.filter((bus) => {
      const busStartCity = bus.route.startCity.trim().toLowerCase();
      const busEndCity = bus.route.endCity.trim().toLowerCase();
      const selectedFromCity = fromCity.trim().toLowerCase();
      const selectedToCity = toCity.trim().toLowerCase();
      const busDate = bus.date
        ? new Date(bus.date).toISOString().split("T")[0]
        : null;
      return (
        busStartCity === selectedFromCity &&
        busEndCity === selectedToCity &&
        busDate === selectedDate
      );
    });
    setFilteredBuses(results);
    setLoading(false);
  };

  const handleSubmit = () => {
    setLoading(true);
    setHasSearched(true);
    filterBuses();
  };

  const handleBookTicket = (busId) => {
    navigation.navigate("BookTicket", { busId });
  };

  const busesToShow = hasSearched ? filteredBuses : buses;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bus Booking Form</Text>

      <AppSelect
        selectedValue={formData.fromCity}
        items={cities.map((city) => ({ label: city, value: city }))}
        onValueChange={(itemValue) => handleInputChange("fromCity", itemValue)}
        value={formData.fromCity}
        placeholder="Select From City"
      />
      <AppSelect
        selectedValue={formData.toCity}
        items={cities.map((city) => ({ label: city, value: city }))}
        onValueChange={(itemValue) => handleInputChange("toCity", itemValue)}
        value={formData.toCity}
        placeholder="Select To City"
      />

      <AppDatePicker
        value={formData.date}
        onChange={onDateChange}
        placeholder="Select date"
        variant="primary"
        borderRadius={12}
      />

      <AppButton text="Search" onPress={handleSubmit} variant="secondary" />

      <View style={styles.results}>
        <Text style={styles.resultsTitle}>
          {hasSearched ? "Search Results" : "All Available Buses"}
        </Text>

        {busesToShow.length > 0
          ? busesToShow.map((bus, index) => (
              <BusCard key={bus._id || index} bus={bus} index={index + 1} />
            ))
          : !loading && <Text style={styles.noBusText}>No buses found</Text>}

        {/* Loader after showing buses */}
        {loading && (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loader}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 30,
    backgroundColor: "#FFFFFF",
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2C3E50",
    marginBottom: 24,
  },
  results: {
    marginTop: 16,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 12,
    color: "#2C3E50",
    textAlign: "center",
  },
  loader: {
    marginTop: 20,
  },
  noBusText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#7F8C8D",
  },
});

export default BookingForm;
