
// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "mindbloom-l8ow7",
  appId: "1:202583968080:web:67b025852515f4d07d8455",
  storageBucket: "mindbloom-l8ow7.firebasestorage.app",
  apiKey: "AIzaSyAPZaKwIGQiHuiynQH47jx35k7rlZSanoM",
  authDomain: "mindbloom-l8ow7.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "202583968080"
};

const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment) {
    firebaseConfig.authDomain = 'localhost:9002';
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

if (isDevelopment && process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    connectAuthEmulator(auth, `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}`);
}


export { app, auth, db };
