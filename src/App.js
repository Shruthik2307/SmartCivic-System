import React from "react";

function App() {
  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#0f172a",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial"
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>
        SmartCivic
      </h1>

      <p style={{ marginBottom: "40px" }}>
        Role-Based Smart Civic Complaint System
      </p>

      <div>
        <button
          style={{
            padding: "12px 30px",
            marginRight: "20px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Login
        </button>

        <button
          style={{
            padding: "12px 30px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Signup
        </button>
      </div>
    </div>
  );
}

export default App;