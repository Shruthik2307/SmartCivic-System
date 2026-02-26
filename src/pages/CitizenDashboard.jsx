import React, { useState } from "react";
import "../index.css";

export default function CitizenDashboard() {
  const [location, setLocation] = useState("");

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation(
        pos.coords.latitude + ", " + pos.coords.longitude
      );
    });
  };

  return (
    <div className="dashboard">

      <h1>Report an Issue</h1>

      <div className="card">

        <input type="file" />

        <button onClick={getLocation}>
          Get Current Location
        </button>

        <input value={location} readOnly />

        <textarea
          rows="4"
          placeholder="Describe the issue"
        ></textarea>

        <button>Submit Complaint</button>

      </div>
    </div>
  );
}