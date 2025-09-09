// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, Auth } from "firebase/auth";
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

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

const isDevelopment = process.env.NODE_ENV === 'development';

try {
    if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApp();
    }

    auth = getAuth(app);
    db = getFirestore(app);

    if (isDevelopment && process.env.NEXT_PUBLIC_EMULATOR_HOST) {
      // It's important to check if the emulator is already connected
      // to prevent errors on hot reloads.
      if (!(auth as any).emulatorConfig) {
        connectAuthEmulator(auth, `http://${process.env.NEXT_PUBLIC_EMULATOR_HOST}:9099`, { disableWarnings: true });
        console.log("Connected to Firebase Auth Emulator");
      }
    } else if (isDevelopment && firebaseConfig.authDomain !== 'localhost:9002') {
        firebaseConfig.authDomain = 'localhost:9002';
    }

} catch (error) {
    console.error("Firebase initialization error:", error);
    // In case of an error, we still want to export something to avoid breaking the app.
    if (!app!) {
      app = initializeApp(firebaseConfig);
    }
    if (!auth!) {
        auth = getAuth(app);
    }
    if(!db!) {
        db = getFirestore(app);
    }
}


export { app, auth, db };
