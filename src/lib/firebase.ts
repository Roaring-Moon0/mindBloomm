
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};

// This helper function ensures that we have a single instance of the Firebase app.
const getFirebaseApp = (): FirebaseApp => {
    // Before initializing, check if the necessary config values are provided.
    // This helps prevent silent failures.
    if (!firebaseConfig.projectId || firebaseConfig.projectId === 'your-project-id') {
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
