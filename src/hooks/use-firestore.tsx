"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  doc,
  onSnapshot,
  collection,
  query,
  DocumentData,
} from "firebase/firestore";

// Helper to split string path into segments for Firestore
function pathToSegments(path: string): string[] {
  return path.split("/").filter(Boolean);
}

export function useFirestoreDocument<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!path) {
      setData(null);
      setLoading(false);
      return;
    }

    try {
      const docRef = doc(db, ...pathToSegments(path));

      const unsubscribe = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setData({ id: docSnap.id, ...docSnap.data() } as T);
          } else {
            setData(null);
          }
          setLoading(false);
        },
        (err: any) => {
          console.error("Firestore Document Error:", err.code, err.message);
          setError(err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err: any) {
      console.error("Invalid Firestore document path:", path, err);
      setError(err);
      setLoading(false);
    }
  }, [path]);

  return { data, loading, error };
}

export function useFirestoreCollection<T>(path: string) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!path) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      const collectionRef = collection(db, ...pathToSegments(path));
      const q = query(collectionRef);

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const collectionData: T[] = [];
          querySnapshot.forEach((doc) => {
            collectionData.push({ id: doc.id, ...doc.data() } as T);
          });

          // Sort by createdAt if present
          if (
            collectionData.length > 0 &&
            (collectionData[0] as any).createdAt?.toDate
          ) {
            collectionData.sort(
              (a: any, b: any) =>
                b.createdAt.toDate().getTime() -
                a.createdAt.toDate().getTime()
            );
          }

          setData(collectionData);
          setLoading(false);
        },
        (err: any) => {
          console.error(`Firestore Collection Error (${path}):`, err.code, err.message);
          setError(err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err: any) {
      console.error("Invalid Firestore collection path:", path, err);
      setError(err);
      setLoading(false);
    }
  }, [path]);

  return { data, loading, error };
}
