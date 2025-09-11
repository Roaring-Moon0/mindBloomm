
'use server';

import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

/**
 * Updates the survey URL in the Firestore configuration.
 * @param url The new URL for the survey form.
 */
export async function updateSurveyUrl(url: string): Promise<void> {
  try {
    const configRef = doc(db, 'config', 'survey');
    // Using setDoc with merge: true will create the document if it doesn't exist,
    // or update it if it does.
    await setDoc(configRef, { url: url }, { merge: true });
  } catch (error) {
    console.error("Error updating survey URL:", error);
    // Re-throw the error to be handled by the calling function
    throw new Error("Failed to update the survey URL in the database.");
  }
}
