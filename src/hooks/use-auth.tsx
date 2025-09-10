
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut, getRedirectResult, UserCredential } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { toast } from './use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to create user document if it doesn't exist
const ensureUserDocument = async (user: User) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
        await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0],
            photoURL: user.photoURL,
            createdAt: new Date(),
        });
        return true; // Indicates a new user was created
    }
    return false; // Indicates user already existed
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // This effect handles both redirect results and persisted auth state.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true); // Start loading when auth state might be changing
      if (currentUser) {
        await ensureUserDocument(currentUser);
        setUser(currentUser);
      } else {
        // If there's no persisted user, check for a redirect result.
        try {
            const result = await getRedirectResult(auth);
            if (result && result.user) {
                const isNewUser = await ensureUserDocument(result.user);
                 if (isNewUser) {
                     toast({
                        title: "Account Created!",
                        description: `Welcome to MindBloom, ${result.user.displayName || 'Friend'}.`,
                    });
                } else {
                     toast({
                        title: "Login Successful!",
                        description: `Welcome back, ${result.user.displayName || 'Friend'}.`,
                    });
                }
                router.push('/dashboard');
                setUser(result.user); // Set user immediately after successful redirect
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Auth Error:", error);
            setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const logout = async () => {
    await signOut(auth);
    // The onAuthStateChanged listener will handle setting user to null.
    router.push('/'); 
  };

  const value = {
    user,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
