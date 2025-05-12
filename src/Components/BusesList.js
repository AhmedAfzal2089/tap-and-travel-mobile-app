
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import { format12time, formatDate } from "../utils/helperFunction";

const BusesList = ({ handleBookTicket }) => {
  // Fetching buses from Redux state
  const buses = useSelector((state) => state.buses.data);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Buses</Text>
      <View style={styles.results}>
        {buses.length > 0 ? (
          buses.map((bus, index) => (
            <View key={index} style={styles.busCard}>
              <Text style={styles.busCompany}>{bus.adminName}</Text>
              <View style={styles.routeContainer}>
                <Text style={styles.cityText}>
                  {bus.route.startCity}
                  {"   "}
                </Text>
                <Icon
                  name="arrow-right"
                  size={18}
                  color="black"
                  style={styles.arrowIcon}
                />
                <Text style={styles.cityText}>
                  {"   "}
                  {bus.route.endCity}
                </Text>
              </View>

              <Text style={styles.price}>
                Only in Rs. {bus.fare.actualPrice}
              </Text>
              <Text style={styles.dateTime}>
                {formatDate(bus.date)} {bus.time}
              </Text>
              <Text style={styles.dateTime}>
                {format12time(bus.departureTime)}
                {"  "}
                <Icon
                  name="arrow-right"
                  size={18}
                  color="black"
                  style={styles.arrowIcon}
                />
                {"  "}
                {format12time(bus.arrivalTime)}
              </Text>
              <Text style={styles.stops}>
                Stops: {bus.route.stops?.length - 2 || 0}
              </Text>

              {/* Book Button */}
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => handleBookTicket(bus._id)}
              >
                <Text style={styles.bookButtonText}>Book my Ticket</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text>No buses found</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  results: {
    marginTop: 20,
  },
  busCard: {
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  busCompany: {
    fontSize: 18,
    fontWeight: "bold",
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  arrowIcon: {
    marginHorizontal: 10,
  },
  price: {
    fontSize: 16,
    color: "green",
    textAlign: "center",
    marginBottom: 5,
  },
  dateTime: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 5,
  },
  stops: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 10,
  },
  bookButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BusesList;
