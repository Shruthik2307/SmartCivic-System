import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import "../index.css";

export default function OfficerDashboard({ setPage }) {
  const [data, setData] = useState([]);
  const [department, setDepartment] = useState("All");
  const [loading, setLoading] = useState(false);

  const departments = ["All", "Sanitation", "Roads", "Electrical", "Water"];

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      // Fetch all complaints without filtering by status
      const snapshot = await getDocs(collection(db, "complaints"));
      let list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Filter by department if selected
      if (department !== "All") {
        list = list.filter(c => c.department === department);
      }
      
      // Sort by createdAt
      list.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.toMillis() - a.createdAt.toMillis();
        }
        return 0;
      });
      
      setData(list);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "complaints", id), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      fetchComplaints();
      alert("Status updated successfully!");
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
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

  // Calculate severity from category if not stored
  const calculateSeverity = (complaint) => {
    if (complaint.severity) return complaint.severity;
    
    const severityMap = {
      Garbage: 2,
      Pothole: 4,
      Streetlight: 3,
      Drainage: 5
    };
    return severityMap[complaint.category] || 1;
  };

  const getRiskBadge = (severity) => {
    if (!severity) return null;
    if (severity >= 4) return { label: "High Risk", color: "#dc2626" };
    if (severity >= 2) return { label: "Medium Risk", color: "#f59e0b" };
    return { label: "Low Risk", color: "#10b981" };
  };

  return (
    <div className="dashboard">
      <Navbar setPage={setPage} />
      
      <div className="dashboard-header">
        <h1>Officer Panel</h1>
        <div className="filter-container">
          <label>Filter by Department: </label>
          <select value={department} onChange={(e) => setDepartment(e.target.value)}>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading complaints...</p>
      ) : data.length === 0 ? (
        <div className="card">
          <p>No complaints found.</p>
        </div>
      ) : (
        <div className="complaints-grid">
          {data.map((c, i) => {
            const severity = calculateSeverity(c);
            const riskBadge = getRiskBadge(severity);
            return (
              <div key={i} className="card complaint-card">
                <div className="complaint-header">
                  <span className="category">{c.category}</span>
                  <span className="status" style={{backgroundColor: getStatusColor(c.status)}}>
                    {c.status}
                  </span>
                </div>
                {riskBadge && (
                  <span className="risk-badge" style={{backgroundColor: riskBadge.color}}>
                    {riskBadge.label}
                  </span>
                )}
                <p className="department">🏢 {c.department}</p>
                <p className="description">{c.desc}</p>
                <p className="location">📍 {c.location}</p>
                {c.userEmail && (
                  <p className="user-email">👤 Submitted by: {c.userEmail}</p>
                )}
                {c.imageURL && (
                  <img src={c.imageURL} alt="Complaint" className="complaint-image" />
                )}
                <div className="status-actions">
                  <label>Update Status:</label>
                  <select 
                    value={c.status} 
                    onChange={(e) => updateStatus(c.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
