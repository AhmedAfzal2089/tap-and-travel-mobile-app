import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import apiClient from "../../api/apiClient";

const TrackLocationScreen = ({ route }) => {
  const { busId } = route.params;
  const [userLocation, setUserLocation] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);

  useEffect(() => {
    getUserLocation();
    fetchDriverLocation();

    const interval = setInterval(fetchDriverLocation, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setUserLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  const fetchDriverLocation = async () => {
    try {
      const { data } = await apiClient.post(`/location/fetch`, {
        busId: busId,
      });
      const { driverLatitude, driverLongitude } = data?.data;
      console.log("Locaiton Api res", data);
      setDriverLocation({
        latitude: driverLatitude,
        longitude: driverLongitude,
      });
    } catch (error) {
      console.error("Error fetching driver location:", error);
    }
  };

  if (!userLocation || !driverLocation) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      <Marker coordinate={userLocation} title="You" pinColor="blue" />
      <Marker coordinate={driverLocation} title="Bus" pinColor="green" />

      <Polyline
        coordinates={[userLocation, driverLocation]}
        strokeColor="#000"
        strokeWidth={2}
      />
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TrackLocationScreen;
