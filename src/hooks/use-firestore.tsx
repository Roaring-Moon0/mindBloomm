
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
      const pathSegments = pathToSegments(path);
      if (pathSegments.length % 2 !== 0) {
        throw new Error("Invalid document path: must have an even number of segments.");
      }
      const docRef = doc(db, ...pathSegments);

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
          console.error(`Firestore Document Error (${path}):`, err.code, err.message);
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
      const pathSegments = pathToSegments(path);
       if (pathSegments.length % 2 === 0) {
        throw new Error("Invalid collection path: must have an odd number of segments.");
      }
      const collectionRef = collection(db, ...pathSegments);
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
            (collectionData[0] as any).createdAt !== undefined
          ) {
            collectionData.sort(
              (a: any, b: any) => {
                const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
                const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
                return timeB - timeA;
              }
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
