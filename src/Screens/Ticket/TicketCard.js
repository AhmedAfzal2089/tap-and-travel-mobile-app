import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import { formatTime } from "../../utils/format-time";
import { getCityShortForm } from "../../utils/get-city-short-form";
import { getTimeDifference } from "../../utils/get-time-difference";
import { formatDateToDayMonth } from "../../utils/format-date-to-day-month";
import { extractSeatNumber } from "../../utils/extract-seat-number";

const TicketCard = ({ ticket }) => {
  const genderText = ticket?.seatDetails?.gender === "M" ? "Male" : "Female";
  const genderColor =
    ticket?.seatDetails?.gender === "M" ? "#27ae60" : "#e84393"; // green / pink

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.flightTitle}>{ticket?.adminName}</Text>

        {/* Seat icon with number in a circle */}
        <View style={styles.seatContainer}>
          <MaterialCommunityIcons
            name="seat-passenger"
            size={20}
            color="#fff"
          />
          <View style={styles.seatNumberCircle}>
            <Text style={styles.seatNumberText}>
              {extractSeatNumber(ticket?.seatNumber)}
            </Text>
          </View>
        </View>
      </View>

      {/* Middle Section */}
      <View style={styles.middle}>
        <View style={styles.flightInfo}>
          {/* Left side: Departure */}
          <View style={{ alignItems: "center" }}>
            <Text style={styles.timeText}>
              {formatTime(ticket?.departureTime)}
            </Text>
            <Text style={styles.dateText}>
              {formatDateToDayMonth(ticket?.date)}
            </Text>
            <Text style={styles.cityText}>
              {getCityShortForm(ticket?.route?.startCity)}
            </Text>
            <Text style={styles.airportText}>{ticket?.route?.startCity}</Text>
          </View>

          {/* Middle Arrow */}
          <View style={styles.middleLine}>
            <Text style={styles.flightDuration}>
              {getTimeDifference(ticket?.departureTime, ticket?.arrivalTime)}
            </Text>
            <View style={styles.arrowWrapper}>
              <View style={styles.circle} />
              <View style={styles.dashedLine} />
              <AntDesign name="arrowright" size={20} color="#fff" />
            </View>
          </View>

          {/* Right side: Arrival */}
          <View style={{ alignItems: "center" }}>
            <Text style={styles.timeText}>
              {formatTime(ticket?.arrivalTime)}
            </Text>
            <Text style={styles.dateText}>
              {formatDateToDayMonth(ticket?.date)}
            </Text>
            <Text style={styles.cityText}>
              {getCityShortForm(ticket?.route?.endCity)}
            </Text>
            <Text style={styles.airportText}>{ticket?.route?.endCity}</Text>
          </View>
        </View>
      </View>

      {/* Separator Line */}
      <View style={styles.separator} />

      {/* Ticket Price */}
      <View style={styles.bookingCodeSection}>
        <Text style={styles.bookingLabel}>Ticket Price</Text>
        <Text style={styles.bookingCode}>Rs. {ticket?.fare?.actualPrice}</Text>
      </View>

      {/* Passenger Info */}
      <View style={styles.passengerSection}>
        <Text style={styles.passengerText}>
          {extractSeatNumber(ticket?.seatNumber)}. {ticket?.user}
        </Text>

        {/* Gender Badge */}
        <View style={[styles.badge, { backgroundColor: genderColor }]}>
          <Text style={styles.badgeText}>{genderText}</Text>
        </View>
      </View>

      {/* Side Cutouts */}
      <View style={styles.cutoutLeft} />
      <View style={styles.cutoutRight} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    backgroundColor: "#292966",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    overflow: "visible",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flightTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  seatContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  seatNumberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#5c5c99",
    alignItems: "center",
    justifyContent: "center",
  },
  seatNumberText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  middle: {
    marginTop: 20,
  },
  flightInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  dateText: {
    fontSize: 14,
    color: "#ddd",
  },
  cityText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  airportText: {
    fontSize: 12,
    color: "#ccc",
  },
  middleLine: {
    alignItems: "center",
  },
  flightDuration: {
    fontSize: 14,
    color: "#ddd",
  },
  arrowWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  dashedLine: {
    width: 40, // Make it longer if you want
    height: 1,
    borderWidth: 1,
    borderColor: "#fff",
    borderStyle: "dashed",
    marginHorizontal: 6,
  },

  separator: {
    marginVertical: 20,
    borderWidth: 0.5,
    borderStyle: "dashed",
    borderColor: "#aaa",
  },
  bookingCodeSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  bookingLabel: {
    fontSize: 12,
    color: "#ccc",
  },
  bookingCode: {
    fontSize: 22,
    color: "#ff3f91",
    fontWeight: "bold",
    marginTop: 8,
  },
  passengerSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#444",
    paddingHorizontal: 20,
    gap: 12,
  },
  passengerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginTop: 8,
  },
  badge: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
  },
  cutoutLeft: {
    position: "absolute",
    width: 20,
    height: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    left: -10,
    top: "50%",
    marginTop: -10,
  },
  cutoutRight: {
    position: "absolute",
    width: 20,
    height: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    right: -10,
    top: "50%",
    marginTop: -10,
  },
});

export default TicketCard;
