import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const loginUser = async (email, password) => {
  try {
    const userCred = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return {
      success: true,
      user: userCred.user
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

export const getUserProfile = async (uid) => {
  const userDoc = await getDoc(doc(db, "users", uid)); // ✅ FIXED

  if (!userDoc.exists()) return null;

  return userDoc.data();
};
