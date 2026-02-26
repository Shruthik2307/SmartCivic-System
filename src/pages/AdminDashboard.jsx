export function AdminDashboard({ setPage }) {
  return (
    <div className="dashboard">

      <div className="sidebar">
        <h2>Admin Panel</h2>
        <div className="menu-item">Overview</div>
        <div className="menu-item">Analytics</div>
        <div className="menu-item">Departments</div>
        <div className="menu-item" onClick={() => setPage("login")}>
          Logout
        </div>
      </div>

      <div className="main">
        <h1>City Control Dashboard</h1>

        <div className="stats">
          <div className="stat-card">
            <p>Total Complaints</p>
            <h3>124</h3>
          </div>

          <div className="stat-card">
            <p>Critical Issues</p>
            <h3>18</h3>
          </div>

          <div className="stat-card">
            <p>Resolved</p>
            <h3>87</h3>
          </div>
        </div>

      </div>
    </div>
  );
}