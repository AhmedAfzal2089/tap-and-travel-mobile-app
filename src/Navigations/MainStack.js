import React from "react";
import TabRoutes from "./TabRoutes";
import BookTicket from "../Screens/BookTicket/BookTicket";
import PaymentScreen from "../Screens/Payment/PaymentScreen";

export default function (Stack) {
  return (
    <>
      <Stack.Screen name="MainTabs" component={TabRoutes} />
      <Stack.Screen name="BookTicket" component={BookTicket} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />

    </>
  );
}
