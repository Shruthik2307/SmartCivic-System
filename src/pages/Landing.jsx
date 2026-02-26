import React from "react";
import "../index.css";

export default function Landing({ setPage }) {
  return (
    <div className="landing-wrapper">
      <div className="overlay"></div>

      <div className="top-nav">
        <div className="brand">SmartCivic</div>

        <div className="nav-buttons">
          <button onClick={() => setPage("login")}>
            Login
          </button>
          <button onClick={() => setPage("signup")}>
            Signup
          </button>
        </div>
      </div>

      <div className="hero">
        <div className="hero-content">
          <h1>
            Intelligent Urban Infrastructure
            <br />
            Monitoring & Response System
          </h1>

          <p>
            Transforming civic complaints into actionable city intelligence
            with real-time monitoring, role-based operations,
            and predictive infrastructure analytics.
          </p>

          <button
            className="primary-btn"
            onClick={() => setPage("signup")}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}