import { auth, db } from "../firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "firebase/firestore";


// 🔹 SIGNUP — Auth + Firestore profile
export const signupUser = async (
  name,
  email,
  password,
  role,
  department = ""
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // Create users/{uid}
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role,
      department: role === "officer" ? department : "",
      created_at: serverTimestamp()
    });

    return { success: true };

  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
};


// 🔹 LOGIN
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return { success: true, user: userCredential.user };

  } catch (error) {
    return { success: false, message: error.message };
  }
};


// 🔹 LOGOUT
export const logoutUser = async () => {
  await signOut(auth);
};


// 🔹 GET USER PROFILE (role, department)
export const getUserProfile = async (uid) => {
  const docRef = doc(db, "users", uid);
  const snap = await getDoc(docRef);

  if (snap.exists()) return snap.data();
  return null;
};
