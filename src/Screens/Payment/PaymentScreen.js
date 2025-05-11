import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import Payment from "../../Components/Payment";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import ConfettiCannon from "react-native-confetti-cannon";

const PaymentScreen = ({ route }) => {
  const { amount, busId, userId, userName, email, adminId, selectedSeats } = route.params;
  const [showConfetti, setShowConfetti] = useState(false);

  const handlePaymentSuccess = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000); // Optional reset after 5s
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animatable.View animation="fadeInDown" duration={800} style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Complete Your Payment</Text>
        <Text style={styles.headerSubtitle}>Secure your reservation in just a few steps</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={700} style={styles.cardContainer}>
        <View style={styles.glassCard}>
          <View style={styles.cardHeader}>
            <FontAwesome5 name="file-invoice-dollar" size={24} color="#41E0A8" />
            <Text style={styles.cardTitle}>Billing Summary</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="person" size={20} color="#ffffff" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.label}>Passenger Name</Text>
                <Text style={styles.detail}>{userName}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="email" size={20} color="#ffffff" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.label}>Email Address</Text>
                <Text style={styles.detail}>{email}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
  <View style={styles.iconContainer}>
    <Ionicons name="bus" size={20} color="#ffffff" />
  </View>
  <View style={styles.detailContent}>
    <Text style={styles.label}>Seats Selected</Text>
    <Text style={styles.detail}>
      {selectedSeats?.length} {selectedSeats?.length === 1 ? 'Seat' : 'Seats'}
    </Text>
  </View>
</View>

          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.pricingContainer}>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Ticket Price</Text>
              <Text style={styles.pricingValue}>PKR {amount}</Text>
            </View>
            
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Service Fee</Text>
              <Text style={styles.pricingValue}>PKR 0</Text>
            </View>
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>PKR {amount}</Text>
            </View>
          </View>
        </View>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={700} delay={300} style={styles.paymentButtonContainer}>
        <Payment
          style={styles.button}
          amount={amount}
          busId={busId}
          userId={userId}
          email={email}
          adminId={adminId}
          selectedSeats={selectedSeats}
          onSuccess={handlePaymentSuccess}
        />
        <Text style={styles.secureText}>
          <Ionicons name="lock-closed" size={14} color="#666" /> Secured by SSL Encryption
        </Text>
      </Animatable.View>

      {showConfetti && (
        <>
          <ConfettiCannon count={100} origin={{ x: 0, y: 0 }} fadeOut explosionSpeed={300} />
          <ConfettiCannon count={100} origin={{ x: 400, y: 0 }} fadeOut explosionSpeed={300} />
        </>
      )}
    </ScrollView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f7fb",
    alignItems: "center",
  },
  headerContainer: {
    width: "100%",
    marginBottom: 24,
    marginTop: 10,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#292966",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  cardContainer: {
    width: "100%",
    marginBottom: 24,
  },
  glassCard: {
    backgroundColor: "#292966",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    width: "100%",
  },
  detailsContainer: {
    padding: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  detail: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "500",
  },
  pricingContainer: {
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
  },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  pricingLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  pricingValue: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "500",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.15)",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#41E0A8",
  },
  paymentButtonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: "100%",
    borderRadius: 12,
    paddingVertical: 16,
    backgroundColor: "#41E0A8",
    alignItems: "center",
    justifyContent: "center",
  },
  secureText: {
    fontSize: 12,
    color: "#666",
    marginTop: 12,
    textAlign: "center",
  },
});