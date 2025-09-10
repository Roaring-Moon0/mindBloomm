
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';

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
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is logged in, now check if they are an admin.
        const adminConfigDoc = await getDoc(doc(db, 'config', 'admins'));
        if (adminConfigDoc.exists()) {
          const adminEmails = adminConfigDoc.data().emails as string[];
          if (user.email && adminEmails.includes(user.email)) {
            // This is an admin.
            setUser(user);
            setIsAdmin(true);
          } else {
            // This is a regular user, not an admin.
            await signOut(auth); // Log them out of the admin context.
            setUser(null);
            setIsAdmin(false);
            if (pathname !== '/admin/login') {
                router.push('/admin/login');
            }
          }
        } else {
          // Admin config document doesn't exist.
          await signOut(auth);
          setUser(null);
          setIsAdmin(false);
          if (pathname !== '/admin/login') {
            router.push('/admin/login');
          }
        }
      } else {
        // No user is logged in.
        setUser(null);
        setIsAdmin(false);
        // If they are trying to access any admin page other than login, redirect them.
        if (pathname !== '/admin/login') {
            router.push('/admin/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

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

  // Do not render children until the loading/auth check is complete.
  // This prevents content flashing or showing a protected page briefly.
  return <AdminAuthContext.Provider value={value}>{!loading && children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
