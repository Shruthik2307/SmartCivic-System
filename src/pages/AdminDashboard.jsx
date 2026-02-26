import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "../components/Navbar";
import "../index.css";

export default function AdminDashboard({ setPage }) {
  const [analytics, setAnalytics] = useState({
    total: 0,
    byStatus: {},
    byCategory: {},
    byDepartment: {}
  });
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("analytics");

  useEffect(() => {
    fetchAnalytics();
    fetchUsers();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const snapshot = await getDocs(collection(db, "complaints"));

      let total = 0;
      const byStatus = {};
      const byCategory = {};
      const byDepartment = {};

      snapshot.forEach((doc) => {
        const d = doc.data();
        total++;

        byStatus[d.status] = (byStatus[d.status] || 0) + 1;
        byCategory[d.category] = (byCategory[d.category] || 0) + 1;
        byDepartment[d.department] = (byDepartment[d.department] || 0) + 1;
      });

      setAnalytics({ total, byStatus, byCategory, byDepartment });
    } catch (err) {
      console.error("Error fetching analytics:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(list);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "#f59e0b";
      case "In Progress": return "#3b82f6";
      case "Resolved": return "#10b981";
      default: return "#6b7280";
    }
  };

  const StatCard = ({ title, value, color }) => (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <h3>{title}</h3>
      <p className="stat-value">{value}</p>
    </div>
  );

  return (
    <div className="dashboard">
      <Navbar setPage={setPage} />
      
      <h1>Admin Control Panel</h1>
      
      <div className="tab-container">
        <button 
          className={`tab ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </button>
        <button 
          className={`tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          User Management ({users.length})
        </button>
      </div>

      {activeTab === "analytics" && (
        <div className="analytics-section">
          <div className="stats-grid">
            <StatCard title="Total Complaints" value={analytics.total} color="#2563eb" />
            {Object.entries(analytics.byStatus).map(([status, count]) => (
              <StatCard 
                key={status} 
                title={`${status} Issues`} 
                value={count} 
                color={getStatusColor(status)} 
              />
            ))}
          </div>

          <div className="analytics-cards">
            <div className="card">
              <h3>By Category</h3>
              {Object.entries(analytics.byCategory).map(([cat, count]) => (
                <div key={cat} className="analytics-item">
                  <span>{cat}</span>
                  <span className="count">{count}</span>
                </div>
              ))}
            </div>

            <div className="card">
              <h3>By Department</h3>
              {Object.entries(analytics.byDepartment).map(([dept, count]) => (
                <div key={dept} className="analytics-item">
                  <span>{dept}</span>
                  <span className="count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="users-section">
          <div className="card">
            <h3>Registered Users</h3>
            {users.length === 0 ? (
              <p>No users registered.</p>
            ) : (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{user.createdAt || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
