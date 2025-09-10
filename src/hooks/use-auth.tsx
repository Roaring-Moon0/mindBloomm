
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut, getRedirectResult } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        
        // After redirect, if the user document doesn't exist, create it.
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
             await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email,
                username: user.displayName || user.email?.split('@')[0],
                createdAt: new Date(),
            });
        }
        
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  // This will handle the redirect result from Google on any page that uses the AuthProvider.
  // It ensures the user data (like creating their doc in Firestore) is handled
  // as soon as they come back to the site.
  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result) {
          // This confirms the user is signed in.
          // The onAuthStateChanged listener above will handle setting the user state.
          toast({
              title: "Login Successful!",
              description: `Welcome back, ${result.user.displayName || 'User'}.`,
          });
          router.push('/dashboard');
        }
      })
      .catch((error) => {
         console.error("Redirect Result Error: ", error);
         if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
              toast({
                variant: "destructive",
                title: "Sign-In Failed",
                description: "Something went wrong during the Google Sign-In. Please try again.",
              });
         }
      })
  }, [router]);


  const logout = async () => {
    await signOut(auth);
    setUser(null);
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
