import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
} from "react-native";
import { apiBaseUrl } from "../../config/urls";
import { useNavigation } from "@react-navigation/native";
import AppButton from "../../Components/Button";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import * as Animatable from "react-native-animatable";

const BookTicket = ({ route }) => {
  const { busId } = route.params;
  const navigation = useNavigation();
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  useEffect(() => {
    const fetchSelectedBus = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/bus/${busId}`);
        const data = await response.json();
        setSelectedBus(data);
      } catch (error) {
        console.error("Error fetching bus data:", error);
      }
    };

    if (busId) {
      fetchSelectedBus();
    }
  }, [busId]);

  const toggleSeatSelection = (seat) => {
    if (seat.booked) return;

    const alreadySelected = selectedSeats.find(
      (s) => s.seatNumber === seat.seatNumber
    );

    if (alreadySelected) {
      setSelectedSeats((prevSeats) =>
        prevSeats.filter((s) => s.seatNumber !== seat.seatNumber)
      );
    } else {
      setSelectedSeats((prevSeats) => [
        ...prevSeats,
        { ...seat, gender: null },
      ]);
    }
  };

  const [currentSeatForGender, setCurrentSeatForGender] = useState(null);

  const handleGenderAssignment = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    const userId = decoded?.sub;
    const userName = decoded?.name;
    const email = decoded?.email;

    // Check if all seats have gender assigned
    const allSeatsHaveGender = selectedSeats.every(seat => seat.gender);
    
    if (!allSeatsHaveGender) {
      Toast.show({
        type: "error",
        text1: "Please assign gender for all selected seats",
      });
      return;
    }

    const totalAmount = selectedSeats.length * selectedBus.fare.actualPrice;

    navigation.navigate("PaymentScreen", {
      busId,
      userId,
      userName,
      email,
      amount: totalAmount,
      adminId: selectedBus?.busDetails?.adminId,
      selectedSeats: selectedSeats,
    });
  };
  
  const handleGenderSelection = (gender) => {
    if (!currentSeatForGender) return;
    
    // Check gender rules
    const neighborGender = currentSeatForGender?.neighborGender;
    if (neighborGender && neighborGender !== gender) {
      Toast.show({
        type: "error",
        text1: `Seat ${currentSeatForGender.seatNumber.split("-")[1]}: Must select ${
          neighborGender === "M" ? "Male" : "Female"
        }`,
      });
      return;
    }
    
    // Update the gender for the current seat only
    setSelectedSeats(prevSeats => 
      prevSeats.map(seat => 
        seat.seatNumber === currentSeatForGender.seatNumber 
          ? { ...seat, gender: gender } 
          : seat
      )
    );
    
    setGenderModalVisible(false);
    setCurrentSeatForGender(null);
  };

  const renderSeat = ({ item }) => {
    const isBooked = item.booked;
    const selectedSeat = selectedSeats.find(
      (s) => s.seatNumber === item.seatNumber
    );
    const isSelected = !!selectedSeat;

    let seatColor = "#BDC3C7"; // default: gray
    if (isBooked) {
      seatColor = item.gender === "M" ? "#4a90e2" : "#e94b86";
    } else if (isSelected) {
      seatColor = "#27ae60";
    }

    return (
      <TouchableOpacity
        style={[styles.seat, { backgroundColor: seatColor }]}
        onPress={() => toggleSeatSelection(item)}
        disabled={isBooked}
      >
        <Text style={styles.seatText}>{item.seatNumber.split("-")[1]}</Text>
        {isBooked && <Text style={styles.gender}>{item?.gender}</Text>}
      </TouchableOpacity>
    );
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    const [hours, minutes] = timeString.split(":");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!selectedBus) {
    return (
      <View style={styles.container}>
        <Text>Loading bus details...</Text>
      </View>
    );
  }

  return (
    <Animatable.View animation="fadeInUp" duration={700} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {selectedBus?.route?.startCity} → {selectedBus?.route?.endCity}
        </Text>
        <TouchableOpacity
          style={styles.viewDetailsButton}
          onPress={() => setDetailsModalVisible(true)}
        >
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Select Your Seat</Text>

      {/* Seat Indication Guide */}
      <View style={styles.seatIndicationContainer}>
        <View style={styles.indicationItem}>
          <View style={[styles.indicationColor, { backgroundColor: "#BDC3C7" }]} />
          <Text style={styles.indicationText}>Available</Text>
        </View>
        <View style={styles.indicationItem}>
          <View style={[styles.indicationColor, { backgroundColor: "#4a90e2" }]} />
          <Text style={styles.indicationText}>Male</Text>
        </View>
        <View style={styles.indicationItem}>
          <View style={[styles.indicationColor, { backgroundColor: "#e94b86" }]} />
          <Text style={styles.indicationText}>Female</Text>
        </View>
        <View style={styles.indicationItem}>
          <View style={[styles.indicationColor, { backgroundColor: "#27ae60" }]} />
          <Text style={styles.indicationText}>Selected</Text>
        </View>
      </View>

      <FlatList
        data={selectedBus.seats}
        numColumns={4}
        keyExtractor={(item) => item.seatNumber}
        renderItem={renderSeat}
        contentContainerStyle={styles.seatLayout}
      />

      {selectedSeats.length > 0 && (
        <View style={styles.selectionInfo}>
          <Text style={styles.selectionText}>Selected Seats:</Text>
          <View style={styles.selectedSeatsContainer}>
            {selectedSeats.map((seat) => (
              <TouchableOpacity
                key={seat.seatNumber}
                style={[
                  styles.selectedSeatChip,
                  {
                    backgroundColor: seat.gender
                      ? seat.gender === "M"
                        ? "#4a90e2"
                        : "#e94b86"
                      : "#27ae60",
                  },
                ]}
                onPress={() => {
                  setCurrentSeatForGender(seat);
                  setGenderModalVisible(true);
                }}
              >
                <Text style={styles.selectedSeatChipText}>
                  {seat.seatNumber.split("-")[1]}
                  {seat.gender ? ` (${seat.gender})` : ""}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <AppButton
            variant="secondary"
            text="Confirm Your Bookings"
            onPress={handleGenderAssignment}
          />
        </View>
      )}

      {/* Gender Selection Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={genderModalVisible}
        onRequestClose={() => {
          setGenderModalVisible(false);
          setCurrentSeatForGender(null);
        }}
      >
        <View style={styles.modalBackground}>
          <Animatable.View animation="zoomIn" style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {currentSeatForGender ? 
                `Select Gender for Seat ${currentSeatForGender.seatNumber.split("-")[1]}` : 
                "Select Gender"}
            </Text>
            <AppButton
              style={{ width: 150 }}
              text="Male"
              variant="secondary"
              onPress={() => handleGenderSelection("M")}
            />
            <View style={{ marginVertical: 8 }} />
            <AppButton
              style={{ width: 150 }}
              text="Female"
              variant="secondary"
              onPress={() => handleGenderSelection("F")}
            />
            <TouchableOpacity
              onPress={() => {
                setGenderModalVisible(false);
                setCurrentSeatForGender(null);
              }}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>

            {/* Bus Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsModalVisible}
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <Animatable.View animation="slideInUp" style={styles.detailsModalContainer}>
            <Text style={styles.modalTitle}>Bus Details</Text>
            <ScrollView style={styles.detailsScrollView}>
              <View style={styles.detailsSection}>
                <Text style={styles.detailsSectionTitle}>Route Information</Text>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>From:</Text>
                  <Text style={styles.detailsValue}>{selectedBus?.route?.startCity}</Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>To:</Text>
                  <Text style={styles.detailsValue}>{selectedBus?.route?.endCity}</Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Departure:</Text>
                  <Text style={styles.detailsValue}>
                    {formatTime(selectedBus?.departureTime)}
                  </Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Arrival:</Text>
                  <Text style={styles.detailsValue}>
                    {formatTime(selectedBus?.arrivalTime)}
                  </Text>
                </View>
              </View>

              <View style={styles.detailsSection}>
                <Text style={styles.detailsSectionTitle}>Bus Information</Text>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Bus Type:</Text>
                  <Text style={styles.detailsValue}>{selectedBus?.busDetails?.busType || "Standard"}</Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Bus No:</Text>
                  <Text style={styles.detailsValue}>{selectedBus?.busDetails?.busNumber || "N/A"}</Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Total Seats:</Text>
                  <Text style={styles.detailsValue}>{selectedBus?.seats?.length || 0}</Text>
                </View>
              </View>

              <View style={styles.detailsSection}>
                <Text style={styles.detailsSectionTitle}>Fare Details</Text>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Base Fare:</Text>
                  <Text style={styles.detailsValue}>
                    PKR {selectedBus?.fare?.actualPrice || 0}</Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Service Fee:</Text>
                  <Text style={styles.detailsValue}>PKR {selectedBus?.fare?.serviceFee || 0}</Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Total Fare:</Text>
                  <Text style={styles.detailsValue}>
                    PKR {selectedBus?.fare?.actualPrice || 0}
                  </Text>
                </View>
              </View>
            </ScrollView>
            <AppButton
              text="Close"
              variant="secondary"
              onPress={() => setDetailsModalVisible(false)}
            />
          </Animatable.View>
        </View>
      </Modal>
    </Animatable.View>
  );
};

export default BookTicket;

const styles = StyleSheet.create({
  selectedSeatsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 16,
  },
  selectedSeatChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  selectedSeatChipText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    backgroundColor: "#F9F9F9",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2C3E50",
    flex: 1,
  },
  viewDetailsButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    elevation: 2,
  },
  viewDetailsText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#7F8C8D",
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  // Seat indication styles
  seatIndicationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
  indicationItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  indicationColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 6,
  },
  indicationText: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  seatLayout: {
    alignItems: "center",
    marginBottom: 40,
  },
  seat: {
    width: 58,
    height: 58,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#BDC3C7",
    elevation: 2,
  },
  seatText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  gender: {
    color: "#fff",
    fontSize: 12,
  },
  selectionInfo: {
    marginTop: 10,
    alignItems: "center",
    paddingBottom: 20,
  },
  selectionText: {
    fontSize: 16,
    color: "#34495E",
    marginBottom: 14,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 32,
    padding: 24,
    borderRadius: 14,
    alignItems: "center",
    elevation: 5,
  },
  detailsModalContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginVertical: 60,
    padding: 24,
    borderRadius: 14,
    elevation: 5,
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 20,
  },
  cancelButton: {
    marginTop: 16,
  },
  cancelButtonText: {
    color: "#7F8C8D",
    fontSize: 14,
  },
  // Details modal styles
  detailsScrollView: {
    flex: 1,
    marginBottom: 20,
  },
  detailsSection: {
    marginBottom: 24,
    backgroundColor: "#f5f6fa",
    padding: 16,
    borderRadius: 10,
  },
  detailsSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailsLabel: {
    flex: 1,
    fontSize: 14,
    color: "#7F8C8D",
  },
  detailsValue: {
    flex: 2,
    fontSize: 14,
    color: "#34495E",
    fontWeight: "500",
  },
});