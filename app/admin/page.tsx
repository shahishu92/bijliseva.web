import React from "react";

export default function AdminPage() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Manage users, view service requests, and monitor status.</p>

      <ul style={{ marginTop: "20px" }}>
        <li>📋 Total Requests: 120</li>
        <li>✅ Completed: 95</li>
        <li>⚙️ Pending: 25</li>
      </ul>
    </div>
  );
}
