import React from "react";

export default function Sidebar({ setPage }) {
  return (
    <div className="sidebar">
      <h2>SmartCivic</h2>

      <p onClick={() => setPage("landing")}>Logout</p>
    </div>
  );
}