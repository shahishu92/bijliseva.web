import "./globals.css";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bijli Seva",
  description: "Electricity Service Portal - Bijli Seva",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "sans-serif",
          backgroundColor: "#f4f4f4",
          color: "#333",
          margin: 0,
          padding: 0,
        }}
      >
        <header
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "15px 20px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          ⚡ Bijli Seva Portal
        </header>
        <main style={{ padding: "20px" }}>{children}</main>
        <footer
          style={{
            backgroundColor: "#007bff",
            color: "white",
            textAlign: "center",
            padding: "10px",
            position: "fixed",
            bottom: 0,
            width: "100%",
          }}
        >
          © {new Date().getFullYear()} Bijli Seva. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
