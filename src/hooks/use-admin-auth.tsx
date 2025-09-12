
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useAuth } from './use-auth';
import { toast } from './use-toast';

interface AdminAuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  isVerifying: boolean;
  logout: () => Promise<void>;
  verifyAdmin: (code: string) => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);


export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading, logout: baseLogout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  const checkSession = useCallback(() => {
    const adminFlag = typeof window !== 'undefined' ? sessionStorage.getItem('isAdmin') === 'true' : false;
    if (adminFlag && user) {
        setIsAdmin(true);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      checkSession();
    }
  }, [authLoading, checkSession]);


  const verifyAdmin = async (code: string) => {
    setLoading(true);
    setIsVerifying(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser?.email) {
          toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to verify.'})
          return false;
      };

      // 1. Check if email is in Firestore "admins" list
      const adminConfigDoc = await getDoc(doc(db, "config", "admins"));
      const adminEmails = adminConfigDoc.exists() ? adminConfigDoc.data().emails || [] : [];
      if (!adminEmails.includes(currentUser.email)) {
          toast({ variant: 'destructive', title: 'Access Denied', description: 'Your account is not approved for admin access.'})
          return false;
      }

      // 2. Check if code matches in "adminCodes" collection
      const q = query(
        collection(db, "adminCodes"),
        where("email", "==", currentUser.email),
        where("code", "==", code),
        where("active", "==", true)
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        toast({ variant: 'destructive', title: 'Invalid Code', description: 'The admin code is incorrect or not active for your account.'})
        return false;
      }

      // All checks passed
      setIsAdmin(true);
      sessionStorage.setItem('isAdmin', 'true');
      return true;
    } catch (err) {
      console.error("Admin verification failed", err);
      toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred during verification.'})
      return false;
    } finally {
      setLoading(false);
      setIsVerifying(false);
    }
  };

  const logout = async () => {
    await baseLogout();
    setIsAdmin(false);
    sessionStorage.removeItem('isAdmin');
    router.push('/');
  };

  const value = {
    user,
    isAdmin,
    loading: authLoading || loading,
    isVerifying,
    logout,
    verifyAdmin,
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
