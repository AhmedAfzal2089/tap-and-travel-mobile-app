import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
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
  const [formErrors, setFormErrors] = useState({
    fromCity: "",
    toCity: "",
    date: "",
  });
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
    // Clear the specific error when the user updates that field
    setFormErrors({
      ...formErrors,
      [name]: "",
    });

    // If changing fromCity or toCity, check if they're the same
    if (name === "fromCity" && value === formData.toCity && value !== "") {
      setFormErrors({
        ...formErrors,
        fromCity: "Departure and arrival cities cannot be the same",
      });
    } else if (name === "toCity" && value === formData.fromCity && value !== "") {
      setFormErrors({
        ...formErrors,
        toCity: "Departure and arrival cities cannot be the same",
      });
    }

    setFormData({ ...formData, [name]: value });
  };

  const onDateChange = (selectedDate) => {
    if (!selectedDate) return;
    
    const formattedDate = new Date(selectedDate).toISOString().split("T")[0];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const selectedDateObj = new Date(selectedDate);
    selectedDateObj.setHours(0, 0, 0, 0);
    
    // Clear the date error
    setFormErrors({
      ...formErrors,
      date: "",
    });
    
    // Check if selected date is in the past
    if (selectedDateObj < today) {
      setFormErrors({
        ...formErrors,
        date: "Cannot select a date in the past",
      });
    }
    
    setFormData({ ...formData, date: formattedDate });
  };

  const validateForm = () => {
    const { fromCity, toCity, date } = formData;
    const newErrors = {
      fromCity: "",
      toCity: "",
      date: "",
    };
    
    let isValid = true;
    
    // Check for empty fields
    if (!fromCity.trim()) {
      newErrors.fromCity = "Please select a departure city";
      isValid = false;
    }
    
    if (!toCity.trim()) {
      newErrors.toCity = "Please select an arrival city";
      isValid = false;
    }
    
    if (!date) {
      newErrors.date = "Please select a date";
      isValid = false;
    }
    
    // Check if fromCity and toCity are the same
    if (fromCity.trim() && toCity.trim() && fromCity.trim() === toCity.trim()) {
      newErrors.fromCity = "Departure and arrival cities cannot be the same";
      newErrors.toCity = "Departure and arrival cities cannot be the same";
      isValid = false;
    }
    
    // Check if date is in the past
    if (date) {
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = "Cannot select a date in the past";
        isValid = false;
      }
    }
    
    setFormErrors(newErrors);
    return isValid;
  };

  const filterBuses = () => {
    const { fromCity, toCity, date } = formData;
    const selectedDate = date
      ? new Date(date).toISOString().split("T")[0]
      : null;
    if (!selectedDate) return;

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
    if (!validateForm()) {
      // Display alert with all errors
      const errorMessages = Object.values(formErrors).filter(error => error);
      if (errorMessages.length > 0) {
        Alert.alert(
          "Form Validation Error",
          errorMessages.join("\n"),
          [{ text: "OK" }]
        );
      }
      return;
    }
    
    setLoading(true);
    setHasSearched(true);
    filterBuses();
  };

  const handleShowAllBuses = () => {
    setHasSearched(false);
  };

  const handleBookTicket = (busId) => {
    navigation.navigate("BookTicket", { busId });
  };

  const busesToShow = hasSearched ? filteredBuses : buses;

  const getErrorStyle = (fieldName) => {
    return formErrors[fieldName] ? styles.inputError : {};
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animatable.View animation="fadeInDown" duration={700}>
        <Text style={styles.title}>🚌 Book Your Bus</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={700} delay={100}>
        <View style={styles.card}>
          <View>
            <AppSelect
              selectedValue={formData.fromCity}
              items={cities.map((city) => ({ label: city, value: city }))}
              onValueChange={(itemValue) =>
                handleInputChange("fromCity", itemValue)
              }
              value={formData.fromCity}
              placeholder="📍 From City"
              style={[styles.select, getErrorStyle("fromCity")]}
            />
            {formErrors.fromCity ? (
              <Text style={styles.errorText}>{formErrors.fromCity}</Text>
            ) : null}
          </View>
          
          <View>
            <AppSelect
              selectedValue={formData.toCity}
              items={cities.map((city) => ({ label: city, value: city }))}
              onValueChange={(itemValue) =>
                handleInputChange("toCity", itemValue)
              }
              value={formData.toCity}
              placeholder="📍 To City"
              style={[styles.select, getErrorStyle("toCity")]}
            />
            {formErrors.toCity ? (
              <Text style={styles.errorText}>{formErrors.toCity}</Text>
            ) : null}
          </View>
          
          <View>
            <AppDatePicker
              value={formData.date}
              onChange={onDateChange}
              placeholder="🗓️ Select Date"
              variant="primary"
              borderRadius={12}
              style={getErrorStyle("date")}
              minimumDate={new Date()} // Prevent selecting past dates in the date picker
            />
            {formErrors.date ? (
              <Text style={styles.errorText}>{formErrors.date}</Text>
            ) : null}
          </View>
          
          <AppButton text="🔍 Search" onPress={handleSubmit} variant="secondary" />
        </View>

        <View style={styles.results}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              {hasSearched ? "🔍 Search Results" : "🧾 All Available Buses"}
            </Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : busesToShow.length > 0 ? (
            busesToShow.map((bus, index) => (
              <Animatable.View
                key={bus._id || index}
                animation="fadeInUp"
                delay={index * 100}
              >
                <BusCard bus={bus} index={index + 1} onBook={handleBookTicket} />
              </Animatable.View>
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noBusText}>No buses found</Text>
              {hasSearched && (
                <AppButton 
                  text="View All Available Buses" 
                  onPress={handleShowAllBuses} 
                  variant="primary"
                  style={styles.viewAllButton}
                />
              )}
            </View>
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
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#D0D3D4",
    color: "#2C3E50",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: "#E74C3C",
    borderWidth: 1,
  },
  errorText: {
    color: "#E74C3C",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 4,
  },
  results: {
    marginTop: 24,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2C3E50",
  },
  noBusText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#7F8C8D",
  },
  noResultsContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  viewAllButton: {
    marginTop: 16,
  },
});