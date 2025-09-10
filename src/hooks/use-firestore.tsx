
"use client";

import { useState, useEffect }from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';

export function useFirestoreDocument<T>(path: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!path) {
            setLoading(false);
            return;
        };

        const docRef = doc(db, path);
        
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setData({ id: docSnap.id, ...docSnap.data() } as T);
            } else {
                // To help with initial setup, we can create a placeholder if it doesn't exist
                // This won't be the final solution, but helps for now.
                console.warn(`Document not found at path: ${path}. No survey URL is configured in the database.`);
                setData(null);
            }
            setLoading(false);
        }, (err) => {
            console.error("Firestore Error:", err);
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [path]);

    return { data, loading, error };
}
