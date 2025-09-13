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
        const adminRef = doc(db, "admins", firebaseUser.uid);
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists()) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
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
      setError(""); // reset previous error

      // 🔍 Search in adminCodes where "code" field matches
      const codesRef = collection(db, "adminCodes");
      const q = query(codesRef, where("code", "==", code.trim()));
      const querySnap = await getDocs(q);

      if (querySnap.empty) {
        setError("Invalid code.");
        return false;
      }

      const matchDoc = querySnap.docs[0];
      const data = matchDoc.data();

      // ✅ check email if you want per-user restriction
      if (data.email && data.email !== user.email) {
        setError("This code is not linked to your account.");
        return false;
      }

      if (data.active === false) {
        setError("This code is not active.");
        return false;
      }

      // ✅ mark user as admin
      const adminRef = doc(db, "admins", user.uid);
      await setDoc(adminRef, { email: user.email }, { merge: true });

      setIsAdmin(true);
      setError("");
      return true;
    } catch (err) {
      console.error("Error verifying admin code:", err);
      setError("Something went wrong.");
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
