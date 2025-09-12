
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useAuth } from './use-auth';
import { verifyAndClaimAdminCode, isApprovedAdmin } from '@/services/config-service';
import { toast } from './use-toast';

interface AdminAuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  isVerifying: boolean;
  logout: () => Promise<void>;
  verifyAdminCode: (code: string) => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_EMAIL_ALLOWLIST = [
  'watervolt69@gmail.com',
  'gauravxns001@gmail.com',
  'kartiksharmaa2066@gmail.com',
  'anubhavahluwalia02@gmail.com',
  'shivimehta2008@gmail.com',
  'ruhikumari2672@gmail.com',
];

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading, logout: baseLogout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAdminStatus = useCallback(async (user: User | null) => {
    if (!user || !user.email) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const isApproved = ADMIN_EMAIL_ALLOWLIST.includes(user.email);
      if (!isApproved) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      const adminCodesRef = doc(db, 'config', 'adminCodes');
      const adminCodesDoc = await getDoc(adminCodesRef);
      
      let hasClaimedCode = false;
      if (adminCodesDoc.exists()) {
          const codes = adminCodesDoc.data();
          for (const code in codes) {
              if (codes[code].claimedBy === user.uid) {
                  hasClaimedCode = true;
                  break;
              }
          }
      }
      setIsAdmin(hasClaimedCode);
    } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      checkAdminStatus(user);
    }
  }, [user, authLoading, checkAdminStatus]);

  const verifyAdminCode = async (code: string): Promise<boolean> => {
    if (!user || !user.email) {
        toast({ variant: 'destructive', title: 'You must be logged in to verify a code.' });
        return false;
    }

    setIsVerifying(true);
    try {
        const isUserApproved = ADMIN_EMAIL_ALLOWLIST.includes(user.email);
        if (!isUserApproved) {
            toast({ variant: 'destructive', title: 'Access Denied', description: 'Your account is not on the approved list for admin access.' });
            return false;
        }

        const isCodeValidAndClaimed = await verifyAndClaimAdminCode(user.uid, code);
        if (isCodeValidAndClaimed) {
            setIsAdmin(true);
        }
        return isCodeValidAndClaimed;
    } catch (error) {
        console.error("Error verifying admin code:", error);
        return false;
    } finally {
        setIsVerifying(false);
    }
  }

  const logout = async () => {
    await baseLogout();
    setIsAdmin(false);
    router.push('/');
  };

  const value = {
    user,
    isAdmin,
    loading: authLoading || loading,
    isVerifying,
    logout,
    verifyAdminCode,
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
