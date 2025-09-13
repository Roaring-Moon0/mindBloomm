"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, doc, getDoc, setDoc, query, where, getDocs } from "firebase/firestore";

type AdminAuthContextType = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  error: string;
  verifyCode: (code: string) => Promise<boolean>;
  logout: () => Promise<void>;
} | null;

const AdminAuthContext = createContext<AdminAuthContextType>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const authState = useProvideAdminAuth();
  return (
    <AdminAuthContext.Provider value={authState}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error("useAdminAuth must be used within an AdminAuthProvider");
    }
    return context;
};

function useProvideAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setUser(firebaseUser);

      if (firebaseUser) {
        // After user logs in, check if they are already a registered admin
        const adminRef = doc(db, "admins", firebaseUser.uid);
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists()) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false); 
        }
      } else {
        // No user, not an admin
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const verifyCode = async (code: string) => {
    if (!user) {
      setError("You must be logged in.");
      return false;
    }

    try {
      setError("Verifying..."); // show status

      const codesRef = collection(db, "adminCodes");
      const q = query(codesRef, where("code", "==", code.trim()));
      console.log("Running query for code:", code);

      const querySnap = await getDocs(q);
      console.log("Query result size:", querySnap.size);

      if (querySnap.empty) {
        console.log("❌ No document found for code:", code);
        setError("Invalid code.");
        return false;
      }

      const matchDoc = querySnap.docs[0];
      const data = matchDoc.data();
      console.log("✅ Found doc:", matchDoc.id, data);

      if (data.email && data.email !== user.email) {
        console.log("❌ Email mismatch. User:", user.email, "Expected:", data.email);
        setError("This code is not linked to your account.");
        return false;
      }

      if (data.active === false) {
        console.log("❌ Code inactive");
        setError("This code is not active.");
        return false;
      }

      // "Promote" the user by adding them to the `admins` collection
      const adminRef = doc(db, "admins", user.uid);
      await setDoc(adminRef, { email: user.email }, { merge: true });

      setIsAdmin(true);
      setError(""); // Clear error on success
      console.log("🎉 Admin status granted for", user.email);
      return true;

    } catch (err) {
      console.error("Error verifying admin code:", err);
      setError("Something went wrong. Check Firestore rules and console for details.");
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
  };

  return { user, isAdmin, loading, error, verifyCode, logout };
}
