
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
        const q = query(collectionRef, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const collectionData: T[] = [];
            querySnapshot.forEach((doc) => {
                collectionData.push({ id: doc.id, ...doc.data() } as T);
            });
            setData(collectionData);
            setLoading(false);
        }, (err: any) => {
            console.error(`Firestore Collection Error (${path}):`, err.code, err.message);
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [path]);

    return { data, loading, error };
}
