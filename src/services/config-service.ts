
'use server';

import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, runTransaction } from 'firebase/firestore';

/**
 * Updates the survey URL in the Firestore configuration.
 * @param url The new URL for the survey form.
 */
export async function updateSurveyUrl(url: string): Promise<void> {
  try {
    const configRef = doc(db, 'config', 'survey');
    await setDoc(configRef, { url: url }, { merge: true });
  } catch (error) {
    console.error("Error updating survey URL:", error);
    throw new Error("Failed to update the survey URL in the database.");
  }
}

/**
 * Verifies an admin code and claims it for a user if it's their first time.
 * @param userId The UID of the user trying to log in.
 * @param code The admin code entered by the user.
 * @returns A boolean indicating if the code is valid and now associated with the user.
 */
export async function verifyAndClaimAdminCode(userId: string, code: string): Promise<boolean> {
  const adminCodesRef = doc(db, 'config', 'adminCodes');
  
  try {
    return await runTransaction(db, async (transaction) => {
      const adminCodesDoc = await transaction.get(adminCodesRef);

      if (!adminCodesDoc.exists()) {
        // For initial setup: if the doc doesn't exist, create it with initial codes.
        const initialCodes = {
            'bl00m-adm-8c2e': { claimedBy: null, createdAt: new Date() },
            'bl00m-adm-f9b1': { claimedBy: null, createdAt: new Date() },
            'bl00m-adm-4a7d': { claimedBy: null, createdAt: new Date() },
            'bl00m-adm-e6f3': { claimedBy: null, createdAt: new Date() },
            'bl00m-adm-9b5h': { claimedBy: null, createdAt: new Date() },
            'bl00m-adm-2k8g': { claimedBy: null, createdAt: new Date() },
        };
        transaction.set(adminCodesRef, initialCodes);
        // Check if the provided code is one of the initial ones
        if (initialCodes.hasOwnProperty(code)) {
            // Claim it immediately
            const updatedCodes = { ...initialCodes, [code]: { claimedBy: userId, createdAt: new Date() } };
            transaction.set(adminCodesRef, updatedCodes);
            return true;
        }
        return false;
      }

      const codes = adminCodesDoc.data();
      const codeData = codes[code];

      // Case 1: Code doesn't exist.
      if (!codeData) {
        return false;
      }

      // Case 2: Code is already claimed by the current user.
      if (codeData.claimedBy === userId) {
        return true;
      }

      // Case 3: Code is claimed by someone else.
      if (codeData.claimedBy) {
        return false;
      }

      // Case 4: Code is valid and unclaimed. Claim it for the current user.
      const updatedCodeData = { ...codeData, claimedBy: userId };
      const updatedCodes = { ...codes, [code]: updatedCodeData };
      transaction.set(adminCodesRef, updatedCodes);
      
      return true;
    });
  } catch (error) {
    console.error("Error in verifyAndClaimAdminCode transaction:", error);
    return false;
  }
}
