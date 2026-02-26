import "../index.css";

export default function Home({ setPage }) {
  return (
    <div className="home">
      <div className="navbar">
        <h2>SmartCivic</h2>
        <div className="nav-buttons">
          <button onClick={()=>setPage("login")}>Login</button>
          <button className="primary" onClick={()=>setPage("signup")}>Signup</button>
        </div>
      </div>

      <div className="hero">
        <div className="hero-content">
          <h1>Smart <span>Civic</span> Monitoring System</h1>
          <p>Empower your community by reporting local issues instantly. Upload photos, add location details, and track resolution progress in real-time.</p>
          <button className="launch-btn" onClick={()=>setPage("login")}>
            Launch System
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
