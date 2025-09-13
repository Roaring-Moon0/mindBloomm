
"use client";

import { useState, useEffect } from 'react';
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
  verifyAdmin: () => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);


export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading, logout: baseLogout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    const checkSessionAndVerify = async () => {
        if (user) {
            const adminFlag = sessionStorage.getItem('isAdmin') === 'true';
            if (adminFlag) {
                setIsAdmin(true);
            } else {
                // If not in session, try to verify automatically
                await verifyAdmin();
            }
        }
        setLoading(false);
    }
    
    if (!authLoading) {
      checkSessionAndVerify();
    }
  }, [authLoading, user]);


  const verifyAdmin = async () => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser?.email) {
          return false;
      };

      const adminConfigDoc = await getDoc(doc(db, "config", "admins"));
      const adminEmails = adminConfigDoc.exists() ? adminConfigDoc.data().emails || [] : [];
      
      if (!adminEmails.includes(currentUser.email)) {
          setIsAdmin(false);
          sessionStorage.removeItem('isAdmin');
          return false;
      }

      setIsAdmin(true);
      sessionStorage.setItem('isAdmin', 'true');
      return true;

    } catch (err) {
      console.error("Admin verification failed", err);
      toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred during admin verification.'})
      return false;
    } finally {
      setLoading(false);
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
  // This is a partial hook implementation for demonstration.
  // The full implementation would require more context from the app.
  // For now, we return a simplified version.
  const { isAdmin, loading } = context;

  const verifyAdmin = async () => {
    return context.verifyAdmin();
  }

  return { isAdmin, verifyAdmin, loading };
}
