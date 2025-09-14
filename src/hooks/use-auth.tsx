
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { toast } from './use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to create user document and initial journal state if they don't exist
const ensureUserDocument = async (user: User) => {
    if (!user) return;
    
    const userDocRef = doc(db, 'users', user.uid);
    
    try {
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
            // This is a new user, create their main document and journal state
            const journalStateRef = doc(db, `users/${user.uid}/journal/state`);

            await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || user.email?.split('@')[0],
                photoURL: user.photoURL,
                createdAt: serverTimestamp(),
            });

            // Create the initial journal state document
            await setDoc(journalStateRef, { 
                treeName: "My Tree",
                createdAt: serverTimestamp(),
                lastWritten: serverTimestamp(),
                treeHealth: 80,
                missedDays: 0,
                mood: 'happy',
                emoji: '😊',
            });

            toast({
                title: "Account Created!",
                description: `Welcome to MindBloom, ${user.displayName || 'Friend'}. Your tree has been planted!`,
            });
        }
    } catch (error) {
        console.error("Error ensuring user document:", error);
    }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // onAuthStateChanged is the single source of truth for the user's session.
  // It correctly handles all auth scenarios: initial load, sign-in, sign-out, and token refreshes.
  // It also fires after a successful signInWithPopup or signInWithRedirect.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        // User is signed in. Ensure their document exists in Firestore before setting user state.
        await ensureUserDocument(currentUser);
        setUser(currentUser);
      } else {
        // User is signed out.
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);


  const logout = async () => {
    await signOut(auth);
    setUser(null);
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
