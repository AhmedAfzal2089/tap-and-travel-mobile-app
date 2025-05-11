import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { format12time, formatDate } from "../../utils/helperFunction";
import { getTimeDifference } from "../../utils/get-time-difference";
import AppButton from "../../Components/Button";
import { useNavigation } from "@react-navigation/native";

const BusCard = ({ bus, index }) => {
  const navigation = useNavigation();

  const handleBookTicket = (busId) => {
    navigation.navigate("BookTicket", { busId });
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.companyContainer}>
          <Text style={styles.companyLabel}>Bus Operator</Text>
          <Text style={styles.company}>{bus?.adminName}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Ticket Price</Text>
          <Text style={styles.price}>PKR {bus?.fare?.actualPrice}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Route and Timing Info */}
      <View style={styles.routeRow}>
        {/* Departure */}
        <View style={styles.timeBlock}>
          <Text style={styles.label}>DEPARTURE</Text>
          <Text style={styles.time}>{format12time(bus?.departureTime)}</Text>
          <Text style={styles.city}>{bus?.route?.startCity}</Text>
          <Text style={styles.date}>{formatDate(bus?.date)}</Text>
        </View>

        {/* Duration */}
        <View style={styles.durationContainer}>
          <View style={styles.durationLine} />
          <View style={styles.durationBlock}>
            <Text style={styles.durationText}>
              {getTimeDifference(bus?.departureTime, bus?.arrivalTime)}
            </Text>
          </View>
          <View style={styles.durationLine} />
        </View>

        {/* Arrival */}
        <View style={styles.timeBlock}>
          <Text style={styles.label}>ARRIVAL</Text>
          <Text style={styles.time}>{format12time(bus?.arrivalTime)}</Text>
          <Text style={styles.city}>{bus?.route?.endCity}</Text>
          <Text style={styles.date}>{formatDate(bus?.date)}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Info Chips */}
      <View style={styles.infoRow}>
        <View style={styles.infoChip}>
          <Text style={styles.infoText}>🛑 Stops: {bus?.route?.stops?.length || 0}</Text>
        </View>
        <View style={styles.infoChip}>
          <Text style={styles.infoText}>👥 Available Seats: {bus?.availableSeats}</Text>
        </View>
        <View style={styles.infoChip}>
          <Text style={styles.infoText}>
            {bus?.busDetails?.standard?.toUpperCase() || "STANDARD"}
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
    padding: 20,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
  },
  companyContainer: {
    flex: 1,
  },
  companyLabel: {
    fontSize: 12,
    color: "#bbbbbb",
    marginBottom: 4,
  },
  company: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  priceLabel: {
    fontSize: 12,
    color: "#bbbbbb",
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#41E0A8",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginVertical: 12,
  },
  routeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  timeBlock: {
    flex: 3,
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 12,
    color: "#bbbbbb",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  time: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 6,
  },
  city: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: "#cccccc",
  },
  durationContainer: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  durationLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  durationBlock: {
    paddingHorizontal: 6,
    alignItems: "center",
  },
  durationText: {
    backgroundColor: "#ffffff",
    color: "#292966",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoChip: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#292966",
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 12,
    alignItems: "center",
  },
});