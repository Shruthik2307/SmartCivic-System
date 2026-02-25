import { auth, db } from "../firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "firebase/firestore";


// 🔹 SIGNUP — Create Auth + Firestore Profile
export const signupUser = async (
  name,
  email,
  password,
  role,
  department = ""
) => {
  try {

    // 1️⃣ Create Auth account
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // 2️⃣ Store profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      role: role,
      department: role === "officer" ? department : "",
      created_at: serverTimestamp()
    });

    return { success: true };

  } catch (error) {
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


// 🔹 GET USER PROFILE (Role, Department)
export const getUserProfile = async (uid) => {

  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
};
