// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "mindbloom-l8ow7",
  appId: "1:202583968080:web:67b025852515f4d07d8455",
  storageBucket: "mindbloom-l8ow7.firebasestorage.app",
  apiKey: process.env.GEMINI_API_KEY || "AIzaSyAPZaKwIGQiHuiynQH47jx35k7rlZSanoM",
  authDomain: "mindbloom-l8ow7.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "202583968080"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
