"use client";

import React, { useState, useEffect } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { auth } from "../../../firebase/clientApp"; // exact path

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export default function LoginPage() {
  const [phone, setPhone] = useState("+91");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // ✅ ensure RecaptchaVerifier uses `auth` object, not string
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth, // ✅ first argument is the Auth instance (not a string)
        "recaptcha-container", // ✅ ID of the container element
        {
          size: "invisible",
        }
      );
    }
  }, []);

  const sendOtp = async () => {
    try {
      const appVerifier = window.recaptchaVerifier!;
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      window.confirmationResult = confirmation;
      alert("OTP sent successfully");
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const verifyOtp = async () => {
    try {
      const result = await window.confirmationResult!.confirm(otp);
      console.log("User verified:", result.user);
      alert("Phone verified!");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Invalid OTP");
    }
  };

  return (
    <main style={{ padding: 20 }}>
      <div id="recaptcha-container"></div>
      <h2>Login with OTP</h2>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+911234567890"
      />
      <button onClick={sendOtp}>Send OTP</button>
      <br />
      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />
      <button onClick={verifyOtp}>Verify OTP</button>
    </main>
  );
}
