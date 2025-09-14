
"use client";

import { useState, useEffect }from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, collection, query, orderBy, DocumentData } from 'firebase/firestore';

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


export function useFirestoreCollection<T>(path: string) {
    const [data, setData] = useState<T[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!path) {
            setLoading(false);
            return;
        }

        const collectionRef = collection(db, path);
        // Removing orderBy to prevent index-related errors.
        const q = query(collectionRef);

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const collectionData: T[] = [];
            querySnapshot.forEach((doc) => {
                collectionData.push({ id: doc.id, ...doc.data() } as T);
            });
            // Manually sort by createdAt on the client-side
            collectionData.sort((a: any, b: any) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
                return dateB - dateA;
            });
            setData(collectionData);
            setLoading(false);
        }, (err) => {
            console.error(`Firestore Error fetching collection ${path}:`, err);
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [path]);

    return { data, loading, error };
}
