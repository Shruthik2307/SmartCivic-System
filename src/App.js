import React, { useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Citizen from "./pages/CitizenDashboard";
import Officer from "./pages/OfficerDashboard";
import Admin from "./pages/AdminDashboard";

export default function App() {
  const [page, setPage] = useState("home");

  if (page === "login") return <Login setPage={setPage} />;
  if (page === "signup") return <Signup setPage={setPage} />;
  if (page === "citizen") return <Citizen setPage={setPage} />;
  if (page === "officer") return <Officer setPage={setPage} />;
  if (page === "admin") return <Admin setPage={setPage} />;

  return <Home setPage={setPage} />;
}