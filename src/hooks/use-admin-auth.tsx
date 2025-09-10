
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface AdminAuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, check for admin privileges
        const adminConfigDoc = await getDoc(doc(db, 'config', 'admins'));
        if (adminConfigDoc.exists()) {
          const adminEmails = adminConfigDoc.data().emails as string[];
          if (user.email && adminEmails.includes(user.email)) {
            setUser(user);
            setIsAdmin(true);
          } else {
            // Not an admin, sign out and redirect
            await signOut(auth);
            setUser(null);
            setIsAdmin(false);
            router.push('/admin/login');
          }
        } else {
          // Admin config doesn't exist, so no one is an admin
          await signOut(auth);
          setUser(null);
          setIsAdmin(false);
          router.push('/admin/login');
        }
      } else {
        // No user is signed in
        setUser(null);
        setIsAdmin(false);
        router.push('/admin/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
    router.push('/admin/login');
  };

  const value = {
    user,
    isAdmin,
    loading,
    logout,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

    