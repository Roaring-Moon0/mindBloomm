
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
        const adminConfigDoc = await getDoc(doc(db, 'config', 'admins'));
        if (adminConfigDoc.exists()) {
          const adminEmails = adminConfigDoc.data().emails as string[];
          if (user.email && adminEmails.includes(user.email)) {
            setUser(user);
            setIsAdmin(true);
          } else {
            await signOut(auth);
            setUser(null);
            setIsAdmin(false);
            if (pathname !== '/admin/login') {
                router.push('/admin/login');
            }
          }
        } else {
          await signOut(auth);
          setUser(null);
          setIsAdmin(false);
          if (pathname !== '/admin/login') {
            router.push('/admin/login');
          }
        }
      } else {
        setUser(null);
        setIsAdmin(false);
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

  // Only render children if loading is false. This prevents rendering the page
  // before the auth check is complete and avoids flashing content.
  return <AdminAuthContext.Provider value={value}>{!loading && children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
