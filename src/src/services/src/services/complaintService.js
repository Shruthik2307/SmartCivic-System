import { db, storage } from "./firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDepartment, calculatePriority } from "./complaintService";
import { query, where, orderBy, getDocs, collection } from "firebase/firestore";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getDocs, collection } from "firebase/firestore";


// B4 — Department Routing

export const getDepartment = (category) => {
  const map = {
    Garbage: "Sanitation",
    Pothole: "Roads",
    Streetlight: "Electrical",
    Drainage: "Water"
  };

  return map[category] || "General";
};
// Get severity based on category
export const getSeverity = (category) => {
  const severityMap = {
    Garbage: 2,
    Pothole: 4,
    Streetlight: 3,
    Drainage: 5
  };

  return severityMap[category] || 1;
};
// Calculate final priority
export const calculatePriority = (
  category,
  nearbyCount = 0,
  hoursPending = 0
) => {
  const severity = getSeverity(category);

  const timeFactor = Math.floor(hoursPending / 24);

  return severity + nearbyCount + timeFactor;
};
export const createComplaint = async (
  userId,
  category,
  description,
  lat,
  lng,
  imageFile,
  nearbyCount = 0
) => {
  try {

    // 1️⃣ Upload image to Storage
    const imageRef = ref(storage, `complaints/${Date.now()}_${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);

    const imageUrl = await getDownloadURL(imageRef);

    // 2️⃣ Department routing (B4)
    const department = getDepartment(category);

    // 3️⃣ Priority calculation (B5)
    const priority = calculatePriority(category, nearbyCount, 0);

    const severityMap = {
      Garbage: 2,
      Pothole: 4,
      Streetlight: 3,
      Drainage: 5
    };

    const severity = severityMap[category] || 1;

    // 4️⃣ Save complaint document
    const docRef = await addDoc(collection(db, "complaints"), {
      user_id: userId,
      category: category,
      description: description,
      lat: lat,
      lng: lng,
      image_url: imageUrl,
      status: "Pending",
      priority: priority,
      severity: severity,
      department: department,
      created_at: serverTimestamp()
    });

    return { success: true, id: docRef.id };

  } catch (error) {
    return { success: false, message: error.message };
  }
};
export const getOfficerComplaints = async (officerDepartment) => {
  try {

    const q = query(
      collection(db, "complaints"),
      where("department", "==", officerDepartment),
      where("status", "!=", "Resolved"),
      orderBy("priority", "desc"),
      orderBy("created_at", "asc")
    );

    const querySnapshot = await getDocs(q);

    const complaints = [];

    querySnapshot.forEach((doc) => {
      complaints.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return { success: true, data: complaints };

  } catch (error) {
    return { success: false, message: error.message };
  }
};
export const updateComplaintStatus = async (complaintId, newStatus) => {
  try {

    const complaintRef = doc(db, "complaints", complaintId);

    await updateDoc(complaintRef, {
      status: newStatus,
      updated_at: serverTimestamp()
    });

    return { success: true };

  } catch (error) {
    return { success: false, message: error.message };
  }
};
export const isValidStatusChange = (current, next) => {
  const flow = {
    "Pending": "In Progress",
    "In Progress": "Resolved"
  };

  return flow[current] === next;
};
// Calculate distance between two coordinates (meters)
const getDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371000; // Earth radius in meters
  const toRad = (v) => (v * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
export const checkHotspot = async (lat, lng) => {
  try {

    const snapshot = await getDocs(collection(db, "complaints"));

    let count = 0;
    const RADIUS = 300;      // meters
    const THRESHOLD = 5;

    snapshot.forEach((doc) => {
      const data = doc.data();

      const distance = getDistance(
        lat,
        lng,
        data.lat,
        data.lng
      );

      if (distance <= RADIUS) count++;
    });

    const isHotspot = count >= THRESHOLD;

    return {
      success: true,
      count: count,
      isHotspot: isHotspot
    };

  } catch (error) {
    return { success: false, message: error.message };
  }
};
import { getDocs, collection } from "firebase/firestore";

export const getAnalyticsData = async () => {
  try {

    const snapshot = await getDocs(collection(db, "complaints"));

    let total = 0;

    const byStatus = {};
    const byCategory = {};
    const byDepartment = {};

    snapshot.forEach((doc) => {
      const data = doc.data();
      total++;

      // Count by Status
      byStatus[data.status] = (byStatus[data.status] || 0) + 1;

      // Count by Category
      byCategory[data.category] = (byCategory[data.category] || 0) + 1;

      // Count by Department
      byDepartment[data.department] = (byDepartment[data.department] || 0) + 1;
    });

    return {
      success: true,
      total,
      byStatus,
      byCategory,
      byDepartment
    };

  } catch (error) {
    return { success: false, message: error.message };
  }
};
