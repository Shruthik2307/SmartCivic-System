import React, { useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CitizenDashboard from "./pages/CitizenDashboard";

export default function App() {
  const [page, setPage] = useState("home");

  if (page === "login") return <Login setPage={setPage} />;
  if (page === "signup") return <Signup setPage={setPage} />;
  if (page === "citizen") return <CitizenDashboard />;

  return <Home setPage={setPage} />;
}