"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

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

  // 🔑 FIXED verifyCode logic
  const verifyCode = async (code: string) => {
    if (!user) {
      setError("You must be logged in.");
      return false;
    }

    try {
      // look for code in Firestore
      const codeRef = doc(db, "adminCodes", code);
      const codeSnap = await getDoc(codeRef);

      if (!codeSnap.exists()) {
        setError("Invalid code.");
        return false;
      }

      const data = codeSnap.data();

      // OPTIONAL: If you want to lock code to one email
      if (data.email && data.email !== user.email) {
        setError("This code is not linked to your account.");
        return false;
      }

      // ✅ mark user as admin (so they won’t need to re-enter next login)
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
