
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
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  const checkAdminStatus = useCallback(async (user: User) => {
    // An admin is someone who is on the approved list AND has claimed a code.
    const adminConfigRef = doc(db, 'config', 'admins');
    const adminCodesRef = doc(db, 'config', 'adminCodes');
    
    const [adminConfigDoc, adminCodesDoc] = await Promise.all([
        getDoc(adminConfigRef),
        getDoc(adminCodesRef)
    ]);

    if (!adminConfigDoc.exists() || !user.email) return false;
    
    const adminEmails = adminConfigDoc.data().emails as string[];
    if (!adminEmails.includes(user.email)) return false;

    // Now, check if this user has claimed any of the codes.
    if (!adminCodesDoc.exists()) return false;
    const codes = adminCodesDoc.data();
    for (const code in codes) {
        if (codes[code].claimedBy === user.uid) {
            return true; // Found a code claimed by this user.
        }
    }
    
    return false; // On the list, but hasn't claimed a code.
  }, []);

  useEffect(() => {
    const performCheck = async () => {
        if (authLoading) {
            // Wait for the main auth hook to finish loading
            return;
        }

        setLoading(true);
        if (user) {
            const isAdminStatus = await checkAdminStatus(user);
            setIsAdmin(isAdminStatus);
        } else {
            setIsAdmin(false);
        }
        setLoading(false);
    };
    performCheck();
  }, [user, authLoading, checkAdminStatus]);

  const verifyAdminCode = async (code: string): Promise<boolean> => {
    if (!user || !user.email) return false;

    setIsVerifying(true);
    try {
        // First, ensure the user's email is on the approved list.
        const adminConfigDoc = await getDoc(doc(db, 'config', 'admins'));
        if (!adminConfigDoc.exists() || !adminConfigDoc.data().emails?.includes(user.email)) {
            return false;
        }
        // Then, try to claim the code.
        const isCodeValid = await verifyAndClaimAdminCode(user.uid, code);
        if (isCodeValid) {
            setIsAdmin(true); // If successful, update state immediately.
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
    loading: loading || authLoading,
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
