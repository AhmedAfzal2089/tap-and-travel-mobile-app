import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ActiveTicketsScreen from "../Screens/Map/ActiveTicketsScreen";
import TrackLocationScreen from "../Screens/Map/TrackLocationScreen";

const Stack = createStackNavigator();

const MapStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ActiveTickets" component={ActiveTicketsScreen} />
      <Stack.Screen name="TrackLocation" component={TrackLocationScreen} />
    </Stack.Navigator>
  );
};

export default MapStack;
