import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
const firebaseConfig = {
  apiKey: "AIzaSyAtHFBZc1OoowEwTOJJWuxkXoGN78C8czQ",
  authDomain: "wowdash-6e530.firebaseapp.com",
  projectId: "wowdash-6e530",
  storageBucket: "wowdash-6e530.firebasestorage.app",
  messagingSenderId: "191428046448",
  appId: "1:191428046448:web:8c1d04b6432bfae3334eb5",
  measurementId: "G-LE1CWEN369",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
export const db = getFirestore(app);

export const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();
const githubAuthProvider = new GithubAuthProvider();

// Register user with username from fire store
export const registerWithEmailAndPassword = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // 🔹 Save user profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      username,
      email: user.email,
      createdAt: serverTimestamp(),
    });

    return user;
  } catch {
    toast.error("Registration failed!");
  }
};

// Login user
export const loginWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    return response;
  } catch {
    toast.error("Invalid Credentials! Invalid email or password.");
  }
};

// Reset Password
export const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch {
    return {
      success: false,
      message: "Failed to send reset email",
    };
  }
};

// Social Login -> Login with google popup
export const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleAuthProvider);
    const user = res.user;
    return user;
  } catch (error) {
    toast.error(`${error}`);
  }
};

// Social Login -> Login with github popup
export const signInWithGithub = async () => {
  try {
    const res = await signInWithPopup(auth, githubAuthProvider);
    const user = res.user;
    return user;
  } catch (error) {
    toast.error(`${error}`);
  }
};

// Get user profile from Fire store
export const getUserProfile = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    return snap.data();
  }

  return null;
};