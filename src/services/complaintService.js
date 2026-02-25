import { db, storage } from "../firebase";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";


// =================================================
// 🔹 B4 — Department Routing
// =================================================
export const getDepartment = (category) => {
  const map = {
    Garbage: "Sanitation",
    Pothole: "Roads",
    Streetlight: "Electrical",
    Drainage: "Water"
  };

  return map[category] || "General";
};


// =================================================
// 🔹 B5 — Severity + Priority
// =================================================
export const getSeverity = (category) => {
  const map = {
    Garbage: 2,
    Pothole: 4,
    Streetlight: 3,
    Drainage: 5
  };

  return map[category] || 1;
};

export const calculatePriority = (
  category,
  nearbyCount = 0,
  hoursPending = 0
) => {
  const severity = getSeverity(category);
  const timeFactor = Math.floor(hoursPending / 24);
  return severity + nearbyCount + timeFactor;
};


// =================================================
// 🔹 B6 — Create Complaint
// =================================================
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

    // Upload image
    const imageRef = ref(
      storage,
      `complaints/${Date.now()}_${imageFile.name}`
    );

    await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(imageRef);

    const department = getDepartment(category);
    const priority = calculatePriority(category, nearbyCount, 0);
    const severity = getSeverity(category);

    const docRef = await addDoc(collection(db, "complaints"), {
      user_id: userId,
      category,
      description,
      lat,
      lng,
      image_url: imageUrl,
      status: "Pending",
      priority,
      severity,
      department,
      created_at: serverTimestamp()
    });

    return { success: true, id: docRef.id };

  } catch (error) {
    return { success: false, message: error.message };
  }
};


// =================================================
// 🔹 B7 — Officer Queries
// =================================================
export const getOfficerComplaints = async (department) => {
  try {

    const q = query(
      collection(db, "complaints"),
      where("department", "==", department),
      where("status", "!=", "Resolved"),
      orderBy("priority", "desc"),
      orderBy("created_at", "asc")
    );

    const snapshot = await getDocs(q);

    const list = [];
    snapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, data: list };

  } catch (error) {
    return { success: false, message: error.message };
  }
};


// =================================================
// 🔹 B8 — Update Status
// =================================================
export const updateComplaintStatus = async (
  complaintId,
  newStatus
) => {
  try {

    const refDoc = doc(db, "complaints", complaintId);

    await updateDoc(refDoc, {
      status: newStatus,
      updated_at: serverTimestamp()
    });

    return { success: true };

  } catch (error) {
    return { success: false, message: error.message };
  }
};


// =================================================
// 🔹 B9 — Hotspot Detection
// =================================================
const getDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371000;
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
  const snapshot = await getDocs(collection(db, "complaints"));

  let count = 0;
  const RADIUS = 300;
  const THRESHOLD = 5;

  snapshot.forEach((doc) => {
    const d = doc.data();
    const dist = getDistance(lat, lng, d.lat, d.lng);
    if (dist <= RADIUS) count++;
  });

  return {
    count,
    isHotspot: count >= THRESHOLD
  };
};


// =================================================
// 🔹 B10 — Analytics
// =================================================
export const getAnalyticsData = async () => {
  const snapshot = await getDocs(collection(db, "complaints"));

  let total = 0;
  const byStatus = {};
  const byCategory = {};
  const byDepartment = {};

  snapshot.forEach((doc) => {
    const d = doc.data();
    total++;

    byStatus[d.status] =
      (byStatus[d.status] || 0) + 1;

    byCategory[d.category] =
      (byCategory[d.category] || 0) + 1;

    byDepartment[d.department] =
      (byDepartment[d.department] || 0) + 1;
  });

  return {
    total,
    byStatus,
    byCategory,
    byDepartment
  };
};
