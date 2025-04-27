import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import apiClient from "../../api/apiClient";
import AppButton from "../../Components/Button";
import TicketCard from "./TicketCard";

const Ticket = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("active");

  const fetchTickets = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return console.warn("Token not found!");
      const decoded = jwtDecode(token);
      const userId = decoded?.sub;
      if (!userId) return console.warn("UserId not found in token!");

      const { data } = await apiClient(`/ticket/user/information/${userId}`);
      setTickets(data);
      filterTickets(data, selectedTab);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    filterTickets(tickets, selectedTab);
  }, [selectedTab]);

  const filterTickets = (ticketsList, tab) => {
    const today = new Date();
    const filtered =
      tab === "active"
        ? ticketsList.filter((ticket) => new Date(ticket?.date) >= today)
        : ticketsList.filter((ticket) => new Date(ticket?.date) < today);

    setFilteredTickets(filtered);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Tickets</Text>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <AppButton
          text="Active"
          variant={selectedTab === "active" ? "primary" : "secondary"}
          onPress={() => setSelectedTab("active")}
        />
        <View style={{ marginHorizontal: 8 }} />
        <AppButton
          text="Past"
          variant={selectedTab === "past" ? "primary" : "secondary"}
          onPress={() => setSelectedTab("past")}
        />
      </View>

      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#2C3E50"
          style={{ marginTop: 24 }}
        />
      ) : (
        <FlatList
          data={filteredTickets}
          keyExtractor={(item, index) => `${item._id}_${index}`}
          renderItem={({ item }) => <TicketCard ticket={item} />}
          ListEmptyComponent={() => (
            <View style={styles.noTicketsContainer}>
              <Text style={styles.noTicketsText}>
                No {selectedTab} tickets found.
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Ticket;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 60, // Increased top padding for better spacing
    backgroundColor: "#FFFFFF", // Clean white background
  },
  header: {
    fontSize: 28,
    color: "#2C3E50", // Darker text for better readability
    marginBottom: 20, // More spacing below header
    fontWeight: "bold",
    textAlign: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12, // Increased spacing under tabs
  },
  tabButton: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    backgroundColor: "#F4F6F8", // Light neutral grey tab
    borderRadius: 12,
    marginHorizontal: 6,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4, // Enhanced Android shadow
  },
  activeTabButton: {
    backgroundColor: "#1ABC9C", // Highlight color for active tab (same)
  },
  tabButtonText: {
    color: "#34495E", // Darker neutral text
    fontWeight: "bold",
    fontSize: 16,
  },
  activeTabButtonText: {
    color: "#FFFFFF", // White text on active tab
  },
  ticketCard: {
    backgroundColor: "#fff",
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginBottom: 24,
    borderRadius: 16,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  ticketText: {
    color: "#2C3E50", // Dark text for readability
    fontSize: 16,
    marginBottom: 8,
  },
  noTicketsContainer: {
    marginTop: 60, // More space before showing "no tickets" message
    alignItems: "center",
  },
  noTicketsText: {
    color: "#95A5A6", // Softer grey for no ticket messages
    fontSize: 16,
  },
});
