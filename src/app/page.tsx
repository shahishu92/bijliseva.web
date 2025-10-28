// src/app/page.tsx
"use client";
import { useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";

if (!globalThis._firebaseInitialized) {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
  initializeApp(firebaseConfig);
  globalThis._firebaseInitialized = true;
}

export default function Page() {
  const [consumerName, setConsumerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const auth = getAuth();
  const storage = getStorage();
  const db = getFirestore();

  const setupRecaptcha = () => {
    // render reCAPTCHA only once
    if (!(window as any).recaptchaRendered) {
      (window as any).recaptchaRendered = true;
      const verifier = new RecaptchaVerifier(
        "recaptcha-container",
        { size: "invisible" },
        auth
      );
      verifier.render();
    }
  };

  async function sendOtp() {
    try {
      setupRecaptcha();
      const verifier = (auth as any).recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, mobile, verifier);
      (window as any).confirmationResult = confirmation;
      setOtpSent(true);
      alert("OTP sent to " + mobile);
    } catch (err) {
      console.error(err);
      alert("Failed to send OTP: " + err);
    }
  }

  async function verifyOtpAndSubmit() {
    try {
      const confirmation = (window as any).confirmationResult;
      await confirmation.confirm(otp); // user signed in
      // upload file if present
      let fileUrl = "";
      if (file) {
        const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        fileUrl = await getDownloadURL(storageRef);
      }
      // save request to Firestore
      await addDoc(collection(db, "serviceRequests"), {
        name: consumerName,
        mobile,
        fileUrl,
        createdAt: new Date(),
        status: "new",
      });
      alert("Request submitted");
      // optionally sign out consumer
    } catch (err) {
      console.error(err);
      alert("OTP verification or submission failed: " + err);
    }
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>BIJLI — Online Service Request</h1>

      <div>
        <label>Consumer Name</label>
        <input value={consumerName} onChange={(e) => setConsumerName(e.target.value)} />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Mobile Number (with country code, e.g. +91XXXXXXXXXX)</label>
        <input value={mobile} onChange={(e) => setMobile(e.target.value)} />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Upload Documents (photo/pdf)</label>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>

      <div id="recaptcha-container"></div>

      {!otpSent ? (
        <button onClick={sendOtp} style={{ marginTop: 12 }}>
          Send OTP
        </button>
      ) : (
        <>
          <div style={{ marginTop: 12 }}>
            <label>Enter OTP</label>
            <input value={otp} onChange={(e) => setOtp(e.target.value)} />
          </div>
          <button onClick={verifyOtpAndSubmit} style={{ marginTop: 12 }}>
            Verify OTP & Submit
          </button>
        </>
      )}

      <hr />
      <h3>Admin login (email/password)</h3>
      <AdminLogin />
    </main>
  );
}

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const auth = getAuth();
  async function login() {
    try {
      await signInWithEmailAndPassword(auth, email, pwd);
      // After sign in, you should call your protected admin page or check admin claim on server
      alert("Admin signed in");
      // redirect to /admin dashboard
      window.location.href = "/admin";
    } catch (err) {
      console.error(err);
      alert("Login failed: " + err);
    }
  }
  return (
    <div>
      <input placeholder="admin email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="password" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
      <button onClick={login}>Admin Login</button>
    </div>
  );
}
