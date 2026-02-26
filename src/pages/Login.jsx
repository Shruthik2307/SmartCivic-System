import React from "react";
import "../index.css";

export default function Login({ setPage }) {
  return (
    <div className="auth-page">
      <div className="auth-box">

        <h2>Login</h2>

        <input placeholder="Email" />
        <input type="password" placeholder="Password" />

        <button onClick={() => setPage("citizen")}>
          Login
        </button>

        <br /><br />

        <button onClick={() => setPage("signup")}>
          Create Account
        </button>

      </div>
    </div>
  );
}