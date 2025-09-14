
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "mindbloom-l8ow7",
  "appId": "1:202583968080:web:67b025852515f4d07d8455",
  "storageBucket": "mindbloom-l8ow7.appspot.com",
  "apiKey": "AIzaSyAPZaKwIGQiHuiynQH47jx35k7rlZSanoM",
  "authDomain": "mindbloom-l8ow7.firebaseapp.com",
  "messagingSenderId": "202583968080"
};

// This helper function ensures that we have a single instance of the Firebase app.
const getFirebaseApp = (): FirebaseApp => {
    // This helps prevent silent failures.
    if (!firebaseConfig.projectId) {
        throw new Error("Firebase project ID is not set. Please check your src/lib/firebase.ts file.");
    }
    
    if (getApps().length > 0) {
        return getApp();
    }
    return initializeApp(firebaseConfig);
}

const app: FirebaseApp = getFirebaseApp();
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
