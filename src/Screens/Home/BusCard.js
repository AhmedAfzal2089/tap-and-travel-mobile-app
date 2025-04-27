import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getCityShortForm } from "../../utils/get-city-short-form";
import { format12time, formatDate } from "../../utils/helperFunction";
import { getTimeDifference } from "../../utils/get-time-difference";
import AppButton from "../../Components/Button";
import { useNavigation } from "@react-navigation/native";

const BusCard = ({ bus }) => {
  const navigation = useNavigation();
  const handleBookTicket = (busId) => {
    navigation.navigate("BookTicket", { busId });
  };
  return (
    <View style={styles.card}>
      {/* Top Section */}
      <View style={styles.topRow}>
        <Text style={styles.company}>{bus?.adminName}</Text>
        <Text style={styles.price}>Rs. {bus?.fare?.actualPrice}</Text>
      </View>

      {/* Time & Route Section */}
      <View style={styles.timeRow}>
        <View style={styles.timeBlock}>
          <Text style={styles.time}>{format12time(bus?.departureTime)}</Text>
          <Text style={styles.city}>{bus?.route?.startCity}</Text>
          <Text style={styles.station}>{formatDate(bus?.date)}</Text>
        </View>

        <View style={styles.durationBlock}>
          <Text style={styles.duration}>
            {getTimeDifference(bus?.departureTime, bus?.arrivalTime)}
          </Text>
        </View>

        <View style={styles.timeBlockTwo}>
          <Text style={styles.time}>{format12time(bus?.arrivalTime)}</Text>
          <Text style={styles.city}>{bus?.route?.endCity}</Text>
          <Text style={styles.station}>{formatDate(bus?.date)}</Text>
        </View>
      </View>

      {/* Buttons Row */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>
            Stops {bus?.route?.stops?.length}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>👥 {bus?.availableSeats}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>
            {bus?.busDetails?.standard?.toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ width: "100%", alignItems: "center", marginTop: 8 }}>
        <AppButton
          text="Book my Ticket"
          variant="green"
          onPress={() => handleBookTicket(bus._id)}
        />
      </View>
    </View>
  );
};

export default BusCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#292966",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  company: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  timeBlock: {
    flex: 3,
    marginRight: 6,
  },
  timeBlockTwo: {
    flex: 3,
    marginLeft: 24,
  },
  time: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  city: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  station: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.7,
  },
  durationBlock: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  duration: {
    backgroundColor: "#FFFFFF",
    color: "#292966",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 4,
    minWidth: "23%",
    alignItems: "center",
  },
  buttonText: {
    color: "#292966",
    fontWeight: "600",
    fontSize: 12,
  },
});
