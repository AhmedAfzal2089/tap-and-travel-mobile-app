import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AppSelect from "../../Components/AppSelect";
import AppDatePicker from "../../Components/AppDatePicker";
import AppButton from "../../Components/Button";
import BusCard from "./BusCard";
import { apiBaseUrl } from "../../config/urls";
import * as Animatable from "react-native-animatable";

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
      const response = await axios.get(`${apiBaseUrl}/bus/future`);
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
    if (!date) return;

    // Get local selected date in 'YYYY-MM-DD' format
    const selectedDate = new Date(date).toISOString().split("T")[0];

    const results = buses.filter((bus) => {
      // Adjust bus date from UTC to Pakistan time manually
      const busDateUTC = new Date(bus.date);

      // Pakistan Standard Time is UTC+5
      const busDateInPK = new Date(busDateUTC.getTime() + 5 * 60 * 60 * 1000);

      const busDateFormatted = busDateInPK.toISOString().split("T")[0];

      const citiesMatch =
        bus.route.startCity.trim().toLowerCase() ===
          fromCity.trim().toLowerCase() &&
        bus.route.endCity.trim().toLowerCase() === toCity.trim().toLowerCase();

      const dateMatch = busDateFormatted === selectedDate;

      return citiesMatch && dateMatch;
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
      <Animatable.View animation="fadeInDown" duration={700}>
        <Text style={styles.title}>🚌 Book Your Bus</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={700} delay={100}>
        <View style={styles.card}>
          <AppSelect
            selectedValue={formData.fromCity}
            items={cities.map((city) => ({ label: city, value: city }))}
            onValueChange={(itemValue) =>
              handleInputChange("fromCity", itemValue)
            }
            value={formData.fromCity}
            placeholder="📍 From City"
            style={styles.select}
          />
          <AppSelect
            selectedValue={formData.toCity}
            items={cities.map((city) => ({ label: city, value: city }))}
            onValueChange={(itemValue) =>
              handleInputChange("toCity", itemValue)
            }
            value={formData.toCity}
            placeholder="📍 To City"
            style={styles.select}
          />
          <AppDatePicker
            value={formData.date}
            onChange={onDateChange}
            placeholder="🗓️ Select Date"
            variant="primary"
            borderRadius={12}
          />
          <AppButton
            text="🔍 Search"
            onPress={handleSubmit}
            variant="secondary"
          />
        </View>

        <View style={styles.results}>
          <Text style={styles.resultsTitle}>
            {hasSearched ? "🔍 Search Results" : "🧾 All Available Buses"}
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : busesToShow.length > 0 ? (
            busesToShow.map((bus, index) => (
              <Animatable.View
                key={bus._id || index}
                animation="fadeInUp"
                delay={index * 100}
              >
                <BusCard
                  bus={bus}
                  index={index + 1}
                  onBook={handleBookTicket}
                />
              </Animatable.View>
            ))
          ) : (
            <Text style={styles.noBusText}>No buses found</Text>
          )}
        </View>
      </Animatable.View>
    </ScrollView>
  );
};

export default BookingForm;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
    backgroundColor: "#F4F6F7",
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2C3E50",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  select: {
    backgroundColor: "#F0F3F5",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#D0D3D4",
    color: "#2C3E50",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  results: {
    marginTop: 24,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 12,
    color: "#2C3E50",
    textAlign: "center",
  },
  noBusText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#7F8C8D",
  },
});
