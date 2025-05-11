import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.company}>{bus?.adminName}</Text>
        <Text style={styles.price}>PKR {bus?.fare?.actualPrice}</Text>
      </View>

      {/* Route and Timing Info */}
      <View style={styles.routeRow}>
        {/* Departure */}
        <View style={styles.timeBlock}>
          <Text style={styles.label}>Departure</Text>
          <Text style={styles.time}>{format12time(bus?.departureTime)}</Text>
          <Text style={styles.city}>{bus?.route?.startCity}</Text>
          <Text style={styles.date}>{formatDate(bus?.date)}</Text>
        </View>

        {/* Duration */}
        <View style={styles.durationBlock}>
          <Text style={styles.durationText}>
            {getTimeDifference(bus?.departureTime, bus?.arrivalTime)}
          </Text>
        </View>

        {/* Arrival */}
        <View style={styles.timeBlock}>
          <Text style={styles.label}>Arrival</Text>
          <Text style={styles.time}>{format12time(bus?.arrivalTime)}</Text>
          <Text style={styles.city}>{bus?.route?.endCity}</Text>
          <Text style={styles.date}>{formatDate(bus?.date)}</Text>
        </View>
      </View>

      {/* Info Chips */}
      <View style={styles.infoRow}>
        <View style={styles.infoChip}>
          <Text style={styles.infoText}>
            🛑 Stops:{" "}
            {bus?.route?.stops?.length - 2 > 0
              ? bus?.route?.stops?.length - 2
              : "0"}
          </Text>
        </View>
        <View style={styles.infoChip}>
          <Text style={styles.infoText}>👥 Seats: {bus?.availableSeats}</Text>
        </View>
        <View style={styles.infoChip}>
          <Text style={styles.infoText}>
            {bus?.busDetails?.standard?.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Book Button */}
      <View style={styles.buttonContainer}>
        <AppButton
          text="Book My Ticket"
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
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  company: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  routeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: "#bbbbbb",
    marginBottom: 2,
  },
  timeBlock: {
    flex: 3,
  },
  time: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  city: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  date: {
    fontSize: 12,
    color: "#cccccc",
  },
  durationBlock: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  durationText: {
    backgroundColor: "#ffffff",
    color: "#292966",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: "bold",
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 12,
  },
  infoChip: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginVertical: 4,
    minWidth: "30%",
    alignItems: "center",
  },
  infoText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#292966",
  },
  buttonContainer: {
    marginTop: 4,
    alignItems: "center",
  },
});
