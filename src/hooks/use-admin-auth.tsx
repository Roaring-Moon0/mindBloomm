
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useAuth } from './use-auth';
import { verifyAndClaimAdminCode } from '@/services/config-service';

interface AdminAuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  isVerifying: boolean;
  logout: () => Promise<void>;
  verifyAdminCode: (code: string) => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading, logout: baseLogout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false); // For the code verification process
  const [loading, setLoading] = useState(true); // For the initial admin status check
  const router = useRouter();

  const checkAdminStatus = useCallback(async (user: User | null) => {
    if (!user || !user.email) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    // An admin is someone who is on the approved list AND has claimed a code.
    const adminConfigRef = doc(db, 'config', 'admins');
    const adminCodesRef = doc(db, 'config', 'adminCodes');
    
    try {
        const [adminConfigDoc, adminCodesDoc] = await Promise.all([
            getDoc(adminConfigRef),
            getDoc(adminCodesRef)
        ]);

        let hasClaimedCode = false;
        if (adminConfigDoc.exists() && adminConfigDoc.data().emails?.includes(user.email)) {
            // User is on the approved list, now check if they have claimed a code.
            if (adminCodesDoc.exists()) {
                const codes = adminCodesDoc.data();
                for (const code in codes) {
                    if (codes[code].claimedBy === user.uid) {
                        hasClaimedCode = true;
                        break;
                    }
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
    // This effect runs when the auth state changes.
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
        const adminConfigDoc = await getDoc(doc(db, 'config', 'admins'));
        if (!adminConfigDoc.exists() || !adminConfigDoc.data().emails?.includes(user.email)) {
            toast({ variant: 'destructive', title: 'Access Denied', description: 'Your account is not on the approved list for admin access.' });
            return false;
        }

        const isCodeValid = await verifyAndClaimAdminCode(user.uid, code);
        if (isCodeValid) {
            setIsAdmin(true); // Manually set admin status to true after successful claim.
        }
        return isCodeValid;
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
