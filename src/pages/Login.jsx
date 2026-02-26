import { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "../index.css";

export default function Login({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, "users", userCred.user.uid));
      
      if (!snap.exists()) {
        setError("User data not found");
        setLoading(false);
        return;
      }

      const role = snap.data().role;

      if (role === "citizen") setPage("citizen");
      else if (role === "officer") setPage("officer");
      else setPage("admin");
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else if (err.code === "auth/user-not-found") {
        setError("No user found with this email");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password");
      } else if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to continue to SmartCivic</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={login}>
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
          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        
        <p className="auth-switch">
          Don't have an account? 
          <span onClick={()=>setPage("signup")}> Sign up</span>
        </p>
      </div>
    </div>
  );
}
