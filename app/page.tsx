import { auth } from "../firebase/clientApp";
import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to Bijli Seva ⚡</h1>
      <p>Your trusted platform for electricity-related services.</p>

      <div style={{ marginTop: "20px" }}>
        <Link href="/login">🔐 Login</Link> |{" "}
        <Link href="/apply">📝 Apply</Link> |{" "}
        <Link href="/admin">🧑‍💼 Admin</Link>
      </div>
    </div>
  );
}
