import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔴 Replace with YOUR config from Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyBSWHxrkGNqD_tGtthJgceN4d1FMvYEowA",
  authDomain: "smart-civic-d2fe7.firebaseapp.com",
  projectId: "smart-civic-d2fe7",
  storageBucket: "smart-civic-d2fe7.firebasestorage.app",
  messagingSenderId: "506999686177",
  appId: "1:506999686177:web:425b4ec02520142ceb0f60",
  measurementId: "G-1N6KX8VTPL"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);