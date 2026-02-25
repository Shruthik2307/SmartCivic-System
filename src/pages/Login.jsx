import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Login({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const userCred = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const userDoc = await getDoc(doc(db, "USERS", userCred.user.uid));
    const role = userDoc.data().role;

    if (role === "citizen") setPage("citizen");
    else if (role === "officer") setPage("officer");
    else setPage("admin");
  };

  return (
    <div>
      <h2>Login</h2>

      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <br />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />
      <br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}