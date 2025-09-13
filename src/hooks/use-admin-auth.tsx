
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
    // This function will run whenever the authentication state changes (login/logout).
    const verifyAdminStatus = async () => {
      // If the main auth hook is still loading or there's no user, we are not an admin.
      if (authLoading || !user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Start the admin-specific loading process.
      setLoading(true);
      try {
        // A user must have an email to be an admin.
        if (!user.email) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        
        // Check Firestore for the admin configuration document.
        const adminConfigDoc = await getDoc(doc(db, "config", "admins"));
        
        if (adminConfigDoc.exists()) {
          const adminEmails = adminConfigDoc.data().emails || [];
          // Check if the current user's email is in the admin list.
          const userIsAdmin = adminEmails.includes(user.email);
          setIsAdmin(userIsAdmin);
        } else {
          // If the config/admins document doesn't exist, no one is an admin.
          setIsAdmin(false);
          console.warn("Admin config document not found at 'config/admins'.");
        }
      } catch (err) {
        console.error("Admin verification failed:", err);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not verify admin status.' });
        setIsAdmin(false);
      } finally {
        // We're done with the admin-specific loading.
        setLoading(false);
      }
    };

    verifyAdminStatus();
  }, [user, authLoading]); // Rerun this effect when the user or authLoading state changes.

  const logout = async () => {
    await baseLogout();
    setIsAdmin(false); // Reset admin state on logout
    router.push('/');
  };

  const value = {
    user,
    isAdmin,
    // The overall loading state is true if either the main auth or the admin check is in progress.
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
