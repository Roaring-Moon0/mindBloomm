
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useAuth } from './use-auth';
import { toast } from './use-toast';

interface AdminAuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);


export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading, logout: baseLogout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyAdminStatus = async () => {
      // Don't do anything if auth is still loading or there's no user.
      if (authLoading) {
        return;
      }
      
      setLoading(true);

      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        if (!user.email) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        
        // Check Firestore for the admin configuration document.
        // The user specified the document ID is 'adminCodes'.
        const adminConfigDoc = await getDoc(doc(db, "config", "adminCodes"));
        
        if (adminConfigDoc.exists()) {
          const adminEmails = adminConfigDoc.data().emails || [];
          const userIsAdmin = adminEmails.includes(user.email);
          setIsAdmin(userIsAdmin);
        } else {
          setIsAdmin(false);
          console.warn("Admin config document not found at 'config/adminCodes'.");
        }
      } catch (err) {
        console.error("Admin verification failed:", err);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not verify admin status.' });
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAdminStatus();
  }, [user, authLoading]);

  const logout = async () => {
    await baseLogout();
    setIsAdmin(false);
    router.push('/');
  };

  const value = {
    user,
    isAdmin,
    loading: authLoading || loading,
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
