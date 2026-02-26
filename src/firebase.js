import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/* ===== YOUR FIREBASE CONFIG ===== */

const firebaseConfig = {
  apiKey: "AIzaSyBSWHxrkGNqD_tGtthJgceN4d1FMvYEowA",
  authDomain: "smart-civic-d2fe7.firebaseapp.com",
  projectId: "smart-civic-d2fe7",
  storageBucket: "smart-civic-d2fe7.firebasestorage.app",
  messagingSenderId: "506999686177",
  appId: "1:506999686177:web:425b4ec02520142ceb0f60"
};

/* ===== INITIALIZE ===== */

const app = initializeApp(firebaseConfig);

/* ===== SERVICES ===== */

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;