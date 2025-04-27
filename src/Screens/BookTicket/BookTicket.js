import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
} from "react-native";
import { apiBaseUrl } from "../../config/urls";
import { useNavigation } from "@react-navigation/native";
import AppButton from "../../Components/Button";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const BookTicket = ({ route }) => {
  const { busId } = route.params;
  const navigation = useNavigation();
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [genderModalVisible, setGenderModalVisible] = useState(false);

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

  const handleGenderSelection = async (gender) => {
    console.log("Gender", gender);
    console.log("Seats", selectedSeats);
    // Check gender compatibility
    for (let seat of selectedSeats) {
      console.log("Seat", seat);
      const neighborGender = seat?.neighborGender;
      console.log(" N Gender", neighborGender);
      if (neighborGender) {
        if (neighborGender !== gender) {
          Toast.show({
            type: "error",
            text1: `Seat ${seat.seatNumber.split("-")[1]}: Must select ${
              neighborGender === "M" ? "Male" : "Female"
            }`,
          });
          return; // Stop further execution
        }
      }
    }

    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    const userId = decoded?.sub;
    const userName = decoded?.name;
    const email = decoded?.email;

    const updatedSeats = selectedSeats.map((seat) => ({
      ...seat,
      gender: gender,
    }));

    setSelectedSeats(updatedSeats);
    setGenderModalVisible(false);

    const totalAmount = selectedSeats.length * selectedBus.fare.actualPrice;

    navigation.navigate("PaymentScreen", {
      busId,
      userId: userId,
      userName,
      email,
      amount: totalAmount,
      adminId: selectedBus?.busDetails?.adminId,
      selectedSeats: updatedSeats, // small fix here too
    });
  };

  const renderSeat = ({ item }) => {
    const isBooked = item.booked;
    const selectedSeat = selectedSeats.find(
      (s) => s.seatNumber === item.seatNumber
    );
    const isSelected = !!selectedSeat;

    let seatColor = "gray";
    if (isBooked) {
      seatColor = item.gender === "M" ? "#4a90e2" : "#e94b86"; // Blue / Pink
    } else if (isSelected) {
      seatColor = "green";
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

  if (!selectedBus) {
    return (
      <View style={styles.container}>
        <Text>Loading bus details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {selectedBus?.route?.startCity} to {selectedBus?.route?.endCity}
      </Text>
      <Text style={styles.subtitle}>Select Your Seat</Text>

      <FlatList
        data={selectedBus.seats}
        numColumns={4}
        keyExtractor={(item) => item.seatNumber}
        renderItem={renderSeat}
        contentContainerStyle={styles.seatLayout}
      />

      {/* Show confirm button when seats are selected */}
      {selectedSeats.length > 0 && (
        <View style={styles.selectionInfo}>
          <Text style={styles.selectionText}>
            Selected Seats:{" "}
            {selectedSeats.map((s) => s.seatNumber.split("-")[1]).join(", ")}
          </Text>
          <AppButton
            variant="secondary"
            text="Confirm Your Bookings"
            onPress={() => setGenderModalVisible(true)}
          />
          <View style={{ marginVertical: 8 }} />
        </View>
      )}

      {/* Gender Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={genderModalVisible}
        onRequestClose={() => setGenderModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Gender</Text>
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
              onPress={() => setGenderModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60, // Increased spacing from the top
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: "#7F8C8D",
    textAlign: "center",
    marginBottom: 32,
  },
  seatLayout: {
    alignItems: "center",
    marginBottom: 40,
  },
  seat: {
    width: 60,
    height: 60,
    margin: 10, // Slightly more space between seats
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#3498DB", // Example color for available seat
  },
  seatText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  gender: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  selectionInfo: {
    marginTop: 40,
    alignItems: "center",
  },
  selectionText: {
    fontSize: 18,
    color: "#34495E",
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: "#1ABC9C",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
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
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 24,
  },
  genderButton: {
    width: "80%",
    paddingVertical: 14,
    borderRadius: 10,
    marginVertical: 12,
    alignItems: "center",
    backgroundColor: "#2980B9",
  },
  genderButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 20,
  },
  cancelButtonText: {
    color: "#7F8C8D",
    fontSize: 14,
  },
});

export default BookTicket;
