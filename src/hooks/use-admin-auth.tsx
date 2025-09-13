
"use client";

import { useState, useEffect, createContext, useContext } from 'react';
import { User } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
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


export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading, logout: baseLogout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Check session storage first for a quick verification
      const sessionIsAdmin = sessionStorage.getItem('isAdmin') === 'true';
      if (sessionIsAdmin) {
          setIsAdmin(true);
          setLoading(false);
          return;
      }

      // If not in session, verify against Firestore
      try {
        if (!user.email) {
          setIsAdmin(false);
          return;
        }
        const adminConfigDoc = await getDoc(doc(db, "config", "admins"));
        const adminEmails = adminConfigDoc.exists() ? adminConfigDoc.data().emails || [] : [];
        
        if (adminEmails.includes(user.email)) {
          setIsAdmin(true);
          sessionStorage.setItem('isAdmin', 'true');
        } else {
          setIsAdmin(false);
          sessionStorage.removeItem('isAdmin');
        }
      } catch (err) {
        console.error("Admin verification failed", err);
        toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred during admin verification.' });
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      verifyAdmin();
    }
  }, [authLoading, user]);

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
