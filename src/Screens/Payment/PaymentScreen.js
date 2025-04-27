import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Payment from "../../Components/Payment";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons"; // or "react-native-vector-icons" if not Expo

const PaymentScreen = ({ route }) => {
  const { amount, busId, userId, userName, email, adminId, selectedSeats } =
    route.params;

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Billing Details</Text>

          <View style={styles.detailRow}>
            <MaterialIcons
              name="person"
              size={20}
              color="#ffffff"
              style={styles.icon}
            />
            <Text style={styles.detail}>
              <Text style={styles.label}>Name: </Text>
              {userName}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons
              name="email"
              size={20}
              color="#ffffff"
              style={styles.icon}
            />
            <Text style={styles.detail}>
              <Text style={styles.label}>Email: </Text>
              {email}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <FontAwesome5
              name="money-bill-wave"
              size={20}
              color="#ffffff"
              style={styles.icon}
            />
            <Text style={styles.detail}>
              <Text style={styles.label}>Total Amount: </Text>Rs. {amount}
            </Text>
          </View>
        </View>
      </View>

      <Payment
        style={styles.button}
        amount={amount}
        busId={busId}
        userId={userId}
        email={email}
        adminId={adminId}
        selectedSeats={selectedSeats}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  card: {
    backgroundColor: "#3a3a85",
    padding: 25,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#ffffff",
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: {
    marginRight: 10,
  },
  detail: {
    fontSize: 16,
    color: "#e0e0ff",
  },
  label: {
    fontWeight: "bold",
    color: "#ffffff",
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#5d5de6",
    elevation: 4,
  },
});

export default PaymentScreen;
