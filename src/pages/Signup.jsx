import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

export default function Signup({ setPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("citizen");

  const handleSignup = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "USERS", userCred.user.uid), {
        name,
        email,
        role,
        department: role === "officer" ? "Sanitation" : null
      });

      alert("Signup Successful");
      setPage("login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Signup</h2>

      <input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <select onChange={(e) => setRole(e.target.value)}>
        <option value="citizen">Citizen</option>
        <option value="officer">Officer</option>
        <option value="admin">Admin</option>
      </select>

      <br /><br />

      <button onClick={handleSignup}>Create Account</button>
      <br /><br />

      <button onClick={() => setPage("login")}>
        Back to Login
      </button>
    </div>
  );
}