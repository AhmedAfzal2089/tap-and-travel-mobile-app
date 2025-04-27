import React from 'react'
import { Login, Signup } from '../'
import OtpVerification from '../Screens/OTP/OtpVerification'

export default function (Stack) {
    return (
        <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="OtpVerification" component={OtpVerification} />
        </>
    )
}