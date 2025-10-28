import React from "react";

export default function ApplyPage() {
  return (
    <div>
      <h1>Apply for Bijli Seva</h1>
      <p>Submit your service request below.</p>

      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "400px",
          marginTop: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Full Name"
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          placeholder="Consumer Number"
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <textarea
          placeholder="Describe your issue"
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#28a745",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}
