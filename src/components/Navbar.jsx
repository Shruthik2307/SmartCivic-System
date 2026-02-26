import React from "react";

export default function Navbar({ setPage }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "15px 40px",
      backgroundColor: "#111827",
      color: "white"
    }}>
      <h3>SmartCivic</h3>

      <button onClick={() => setPage("landing")}>
        Logout
      </button>
    </div>
  );
}