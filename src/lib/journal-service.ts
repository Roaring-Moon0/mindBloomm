"use client";

import { db } from "@/lib/firebase-client";
import { getAuth } from "firebase/auth";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";

/**
 * Save or update the journal tree state
 */
export async function saveJournalState(state: any) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");

  const ref = doc(db, `users/${user.uid}/journal/state`);
  await setDoc(ref, state, { merge: true });
}

/**
 * Add a new note (good/bad memory)
 */
export async function addNote(note: { text: string; type: "good" | "bad" }) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");

  const ref = collection(db, `users/${user.uid}/notes`);
  await addDoc(ref, {
    ...note,
    createdAt: new Date(),
  });
}
