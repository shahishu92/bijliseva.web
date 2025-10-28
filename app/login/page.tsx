import React from "react";

export default function LoginPage() {
  return (
    <div>
      <h1>Login - Bijli Seva</h1>
      <p>Login using your mobile number to continue.</p>

      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "300px",
          marginTop: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Enter mobile number"
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button
          type="button"
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Get OTP
        </button>
      </form>
    </div>
  );
}
