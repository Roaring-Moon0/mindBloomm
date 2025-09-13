"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

type AdminAuthContextType = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  verifyCode: (code: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  error: null,
  verifyCode: async () => false,
  logout: async () => {},
});

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsAdmin(false); // always reset until code is entered
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const verifyCode = async (code: string): Promise<boolean> => {
    if (!user?.email) {
      setError("No user logged in.");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const q = query(
        collection(db, "adminCodes"),
        where("email", "==", user.email),
        where("code", "==", code),
        where("active", "==", true)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setIsAdmin(true);
        setLoading(false);
        return true;
      } else {
        setIsAdmin(false);
        setError("Invalid admin code.");
        setLoading(false);
        return false;
      }
    } catch (err: any) {
      console.error("Error verifying admin code:", err);
      setError("Failed to verify admin access. Please try again.");
      setIsAdmin(false);
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AdminAuthContext.Provider
      value={{ user, isAdmin, loading, error, verifyCode, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
