import React from "react";
import "../index.css";

export default function Home({ setPage }) {
  return (
    <div className="home">
      <div className="overlay"></div>

      <div className="navbar">
        <h2>SmartCivic</h2>

        <div className="nav-buttons">
          <button onClick={() => setPage("login")}>Login</button>
          <button onClick={() => setPage("signup")}>Signup</button>
        </div>
      </div>

      <div className="hero">
        <div className="hero-content">

          <h1>Smart Civic Monitoring System</h1>

          <p>
            Report civic issues instantly with image, location
            and description. Authorities respond faster with
            real-time monitoring and prioritization.
          </p>

          <button
            className="launch-btn"
            onClick={() => setPage("login")}
          >
            Launch System
          </button>

        </div>
      </div>
    </div>
  );
}