import React from "react";
import "../index.css";

export default function Signup({ setPage }) {
  return (
    <div className="auth-page">
      <div className="auth-box">

        <h2>Create Account</h2>

        <input placeholder="Name" />
        <input placeholder="Email" />
        <input type="password" placeholder="Password" />

        <button onClick={() => setPage("login")}>
          Signup
        </button>

      </div>
    </div>
  );
}