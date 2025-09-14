
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
        }, (err: any) => {
            console.error("Firestore Document Error:", err.code, err.message);
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [path]);

    useEffect(() => {
        if (error) {
            console.error('Firestore document load error:', error);
        }
    }, [error]);

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
        // Removing orderby to prevent need for composite indexes
        const q = query(collectionRef);

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const collectionData: T[] = [];
            querySnapshot.forEach((doc) => {
                collectionData.push({ id: doc.id, ...doc.data() } as T);
            });
            // Manually sort by date client-side if createdAt exists
            if (collectionData.length > 0 && (collectionData[0] as any).createdAt) {
                collectionData.sort((a: any, b: any) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
            }
            setData(collectionData);
            setLoading(false);
        }, (err: any) => {
            console.error(`Firestore Collection Error (${path}):`, err.code, err.message);
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [path]);
    
    useEffect(() => {
        if (error) {
            console.error('Firestore collection load error:', error);
        }
    }, [error]);

    return { data, loading, error };
}
