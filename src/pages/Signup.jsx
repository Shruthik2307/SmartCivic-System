import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import "../index.css";

export default function Signup({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("citizen");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async (e) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        role,
        email: email,
        createdAt: new Date().toISOString()
      });
      alert("Account created successfully! Please login.");
      setPage("login");
    } catch (err) {
      console.error("Signup error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("Email already registered");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak");
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Create Account</h2>
        <p className="subtitle">Join SmartCivic today</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={signup}>
          <input 
            placeholder="Email address" 
            type="email"
            value={email}
            onChange={e=>setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={e=>setPassword(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e=>setConfirmPassword(e.target.value)} 
          />
          <select value={role} onChange={e=>setRole(e.target.value)}>
            <option value="citizen">Citizen</option>
            <option value="officer">Officer</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        
        <p className="auth-switch">
          Already have an account? 
          <span onClick={()=>setPage("login")}> Sign in</span>
        </p>
      </div>
    </div>
  );
}
