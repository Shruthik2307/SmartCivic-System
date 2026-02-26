import { useState, useEffect, useRef } from "react";
import { auth, db, storage } from "../firebase";
import { addDoc, collection, serverTimestamp, query, where, getDocs, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Navbar from "../components/Navbar";
import "../index.css";

export default function CitizenDashboard({ setPage }) {
  const [image, setImage] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const [location, setLocation] = useState("");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("Garbage");
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState("submit");
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchMyComplaints();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchMyComplaints = async () => {
    try {
      const q = query(
        collection(db, "complaints"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComplaints(list);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(p => {
      const latVal = p.coords.latitude;
      const lngVal = p.coords.longitude;
      setLat(latVal);
      setLng(lngVal);
      setLocation(latVal + ", " + lngVal);
    }, (err) => {
      alert("Unable to get location. Please enable location services.");
    });
  };

  const getSeverity = (cat) => {
    const map = {
      Garbage: 2,
       Pothole: 4,
      Streetlight: 3,
      Drainage: 5
    };
    return map[cat] || 1;
  };

  const departmentMap = {
    Garbage: "Sanitation",
    Pothole: "Roads",
    Streetlight: "Electrical",
    Drainage: "Water"
  };

  const submit = async () => {
    if (!image || !location || !desc || lat === null || lng === null) {
      alert("Please fill in all fields, upload an image, and get your location");
      return;
    }

    setLoading(true);
    try {
      const imgRef = ref(storage, "complaints/" + Date.now() + image.name);
      await uploadBytes(imgRef, image);
      const url = await getDownloadURL(imgRef);

      const severity = getSeverity(category);

      const complaintData = {
        desc: desc,
        location: location,
        lat: lat,
        lng: lng,
        category: category,
        department: departmentMap[category],
        imageURL: url,
        status: "Pending",
        severity: severity,
        priority: severity,
        userId: user.uid,
        userEmail: user.email,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "complaints"), complaintData);

      alert("Complaint submitted successfully!");
      setImage(null);
      setLocation("");
      setLat(null);
      setLng(null);
      setDesc("");
      fetchMyComplaints();
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to submit complaint");
    } finally {
      setLoading(false);
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

  const getRiskBadge = (severity) => {
    if (!severity) return null;
    if (severity >= 4) return { label: "High Risk", color: "#dc2626" };
    if (severity >= 2) return { label: "Medium Risk", color: "#f59e0b" };
    return { label: "Low Risk", color: "#10b981" };
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (err) {
      alert("Unable to access camera. Please grant camera permission.");
    }
  };

  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    
    canvas.toBlob((blob) => {
      const file = new File([blob], "captured_image.jpg", { type: "image/jpeg" });
      setImage(file);
      setCapturedImage(URL.createObjectURL(blob));
      stopCamera();
    }, "image/jpeg");
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      setShowCamera(false);
    }
  };

  return (
    <div className="dashboard">
      <Navbar setPage={setPage} />
      
      <div className="tab-container">
        <button 
          className={`tab ${activeTab === "submit" ? "active" : ""}`}
          onClick={() => setActiveTab("submit")}
        >
          Submit Complaint
        </button>
        <button 
          className={`tab ${activeTab === "my" ? "active" : ""}`}
          onClick={() => setActiveTab("my")}
        >
          My Complaints ({complaints.length})
        </button>
      </div>

      {activeTab === "submit" && (
        <div className="card">
          <h2>Report an Issue</h2>
          
          {showCamera ? (
            <div className="camera-container">
              <video ref={videoRef} autoPlay playsInline className="camera-preview" />
              <div className="camera-buttons">
                <button onClick={capturePhoto} className="capture-btn">📸 Capture</button>
                <button onClick={stopCamera} className="cancel-btn">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label>Upload Image</label>
              <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
              <div className="or-divider">OR</div>
              <button onClick={startCamera} className="camera-btn">📷 Capture from Camera</button>
              {capturedImage && (
                <div className="captured-preview">
                  <img src={capturedImage} alt="Captured" />
                  <button onClick={() => { setImage(null); setCapturedImage(null); }}>Remove</button>
                </div>
              )}
            </div>
          )}
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="Garbage">Garbage</option>
            <option value="Pothole">Pothole</option>
            <option value="Streetlight">Streetlight</option>
            <option value="Drainage">Drainage</option>
          </select>
          <button onClick={getLocation}>Get Location</button>
          <input value={location} readOnly placeholder="Location will appear here" />
          <textarea 
            placeholder="Description" 
            value={desc}
            onChange={e => setDesc(e.target.value)} 
          />
          <button onClick={submit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      )}

      {activeTab === "my" && (
        <div className="complaints-list">
          {complaints.length === 0 ? (
            <div className="card">
              <p>No complaints submitted yet.</p>
            </div>
          ) : (
            complaints.map(c => {
              const riskBadge = getRiskBadge(c.severity);
              return (
                <div key={c.id} className="card complaint-card">
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
                  <p className="description">{c.desc}</p>
                  <p className="location">📍 {c.location}</p>
                  <p className="department">🏢 Department: {c.department}</p>
                  {c.imageURL && (
                    <img src={c.imageURL} alt="Complaint" className="complaint-image" />
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
