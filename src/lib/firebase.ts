
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "mindbloom-l8ow7",
  appId: "1:202583968080:web:67b025852515f4d07d8455",
  storageBucket: "mindbloom-l8ow7.firebasestorage.app",
  apiKey: "AIzaSyAPZaKwIGQiHuiynQH47jx35k7rlZSanoM",
  authDomain: "mindbloom-l8ow7.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "202583968080"
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);

export { app, auth, db };
