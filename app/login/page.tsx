"use client";

import React, { useEffect, useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from "../../firebase/clientApp"; // path from app -> up two levels to firebase

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((globalThis as any).recaptchaVerifier) return;

    (globalThis as any).recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      { size: "invisible" },
      auth
    );
  }, []);

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const normalized = phone.trim();
    if (!/^\+?\d{10,15}$/.test(normalized)) {
      setMessage("Enter phone with country code, e.g. +919876543210");
      return;
    }
    setLoading(true);
    try {
      const verifier = (globalThis as any).recaptchaVerifier;
      if (!verifier) throw new Error("reCAPTCHA not ready");
      const confirmationResult = await signInWithPhoneNumber(auth, normalized, verifier);
      setConfirmation(confirmationResult);
      setMessage("OTP sent — check your phone");
    } catch (err: any) {
      console.error(err);
      setMessage(err?.message || "Failed to send OTP");
      // reset recaptcha (optional)
      try {
        (globalThis as any).recaptchaVerifier?.clear();
        (globalThis as any).recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", { size: "invisible" }, auth);
      } catch {}
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (!confirmation) {
      setMessage("No OTP request found. Click Get OTP first.");
      return;
    }
    if (!otp.trim()) {
      setMessage("Enter OTP");
      return;
    }
    setLoading(true);
    try {
      const userCred = await confirmation.confirm(otp.trim());
      setMessage("Verified! UID: " + userCred.user.uid);
      // TODO: redirect or create user record
    } catch (err: any) {
      console.error(err);
      setMessage(err?.message || "OTP verify failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 520 }}>
      <h2>Login with Phone (OTP)</h2>

      <form onSubmit={sendOtp} style={{ marginTop: 12 }}>
        <label>
          Phone (with country code)
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+919876543210" style={{ width: "100%", padding: 8, marginTop: 6 }} />
        </label>
        <div style={{ marginTop: 8 }}>
          <button type="submit" disabled={loading} style={{ padding: 10 }}>
            {loading ? "Sending..." : "Get OTP"}
          </button>
        </div>
      </form>

      <div id="recaptcha-container" />

      {confirmation && (
        <form onSubmit={verifyOtp} style={{ marginTop: 16 }}>
          <label>
            OTP
            <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" style={{ width: "100%", padding: 8, marginTop: 6 }} />
          </label>
          <div style={{ marginTop: 8 }}>
            <button type="submit" disabled={loading} style={{ padding: 10 }}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </form>
      )}

      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </div>
  );
}
