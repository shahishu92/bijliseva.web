"use client";
import { useState } from "react";
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [user, setUser] = useState<any>(null);

  // OTP Login
  const sendOtp = async () => {
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {});
      const confirmationResult = await signInWithPhoneNumber(auth, "+91" + phone, window.recaptchaVerifier);
      window.confirmationResult = confirmationResult;
      setOtpSent(true);
      alert("OTP sent successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  const verifyOtp = async () => {
    try {
      const result = await window.confirmationResult.confirm(otp);
      setUser(result.user);
      alert("Logged in successfully!");
    } catch (error) {
      alert("Invalid OTP!");
    }
  };

  // Admin Login
  const adminLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      alert("Admin logged in!");
    } catch (error) {
      alert("Invalid email or password");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", paddingTop: "50px" }}>
      <h2 style={{ textAlign: "center" }}>Bijli Seva Login</h2>

      {!user && (
        <>
          <h3>Consumer Login (OTP)</h3>
          <input
            type="text"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <div id="recaptcha-container"></div>
          {!otpSent ? (
            <button onClick={sendOtp} style={{ width: "100%" }}>Send OTP</button>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ width: "100%", marginBottom: "10px" }}
              />
              <button onClick={verifyOtp} style={{ width: "100%" }}>Verify OTP</button>
            </>
          )}

          <hr style={{ margin: "20px 0" }} />

          <h3>Admin Login (Email)</h3>
          <input
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <button onClick={adminLogin} style={{ width: "100%" }}>Login as Admin</button>
        </>
      )}

      {user && <h3>Welcome, {user.phoneNumber || user.email}</h3>}
    </div>
  );
}
