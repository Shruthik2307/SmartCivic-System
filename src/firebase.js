// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSWHxrkGNqD_tGtthJgceN4d1FMvYEowA",
  authDomain: "smart-civic-d2fe7.firebaseapp.com",
  projectId: "smart-civic-d2fe7",
  storageBucket: "smart-civic-d2fe7.firebasestorage.app",
  messagingSenderId: "506999686177",
  appId: "1:506999686177:web:425b4ec02520142ceb0f60",
  measurementId: "G-1N6KX8VTPL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);