// app/login/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { auth } from "../../firebase/clientApp"; // <-- exact path (2 levels up)

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export default function LoginPage() {
  const [phone, setPhone] = useState("+91"); // example default
  const [otp, setOtp] = useState("");

  // create recaptcha verifier on the client only
  useEffect(() => {
    if (typeof window === "undefined") return;

    // only create once
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        { size: "invisible" },
        auth // must pass Firebase Auth instance (not a string)
      );
    }
    // cleanup optional
    return () => {
      // keep instance for convenience (you can clear if needed)
    };
  }, []);

  const sendOtp = async () => {
    try {
      const appVerifier = window.recaptchaVerifier!;
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      window.confirmationResult = confirmation;
      alert("OTP sent");
    } catch (err) {
      console.error("sendOtp error:", err);
      alert("Error sending OTP: " + ((err as Error).message || err));
    }
  };

  const verifyOtp = async () => {
    try {
      const result = await window.confirmationResult!.confirm(otp);
      console.log("Phone verified user:", result.user);
      alert("Phone verified!");
    } catch (err) {
      console.error("verifyOtp error:", err);
      alert("Invalid OTP or verification failed.");
    }
  };

  return (
    <main>
      <div id="recaptcha-container" /> {/* invisible recaptcha mounts here */}

      <div>
        <label>Phone (include country code)</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+911234567890"
        />
        <button onClick={sendOtp}>Send OTP</button>
      </div>

      <div>
        <label>OTP</label>
        <input value={otp} onChange={(e) => setOtp(e.target.value)} />
        <button onClick={verifyOtp}>Verify OTP</button>
      </div>
    </main>
  );
}
