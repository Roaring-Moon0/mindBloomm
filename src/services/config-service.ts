
'use server';

import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, runTransaction, collection, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';

const surveySchema = z.object({
  name: z.string(),
  url: z.string().url(),
});

/**
 * Adds a new survey to the 'surveys' collection in Firestore.
 * @param surveyData The data for the new survey, expecting name and url.
 */
export async function addSurvey(surveyData: z.infer<typeof surveySchema>): Promise<void> {
  try {
    const validatedData = surveySchema.parse(surveyData);
    const surveysCollectionRef = collection(db, 'surveys');
    await addDoc(surveysCollectionRef, {
      ...validatedData,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding survey:", error);
    if (error instanceof z.ZodError) {
      throw new Error("Invalid survey data provided.");
    }
    throw new Error("Failed to add the survey to the database.");
  }
}

/**
 * Deletes a survey from the 'surveys' collection.
 * @param surveyId The ID of the survey document to delete.
 */
export async function deleteSurvey(surveyId: string): Promise<void> {
    if (!surveyId) {
        throw new Error("Survey ID must be provided.");
    }
    try {
        const surveyRef = doc(db, 'surveys', surveyId);
        await deleteDoc(surveyRef);
    } catch (error) {
        console.error("Error deleting survey:", error);
        throw new Error("Failed to delete the survey from the database.");
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

      const initialCodes = {
          'bl00m-adm-8c2e': { claimedBy: null, createdAt: new Date() },
          'bl00m-adm-f9b1': { claimedBy: null, createdAt: new Date() },
          'bl00m-adm-4a7d': { claimedBy: null, createdAt: new Date() },
          'bl00m-adm-e6f3': { claimedBy: null, createdAt: new Date() },
          'bl00m-adm-9b5h': { claimedBy: null, createdAt: new Date() },
          'bl00m-adm-2k8g': { claimedBy: null, createdAt: new Date() },
      };

      if (!adminCodesDoc.exists()) {
        transaction.set(adminCodesRef, initialCodes);
        if (Object.keys(initialCodes).includes(code)) {
            const newCodeData = { ...initialCodes, [code]: { claimedBy: userId, createdAt: new Date() } };
            transaction.set(adminCodesRef, newCodeData);
            return true;
        }
        return false;
      }

      const codes = adminCodesDoc.data();
      const codeData = codes[code];

      if (!codeData) return false; // Code doesn't exist.
      if (codeData.claimedBy === userId) return true; // Already claimed by this user.
      if (codeData.claimedBy) return false; // Claimed by someone else.

      // Code is valid and unclaimed. Claim it.
      transaction.update(adminCodesRef, {
        [`${code}.claimedBy`]: userId,
      });
      
      return true;
    });
  } catch (error) {
    console.error("Error in verifyAndClaimAdminCode transaction:", error);
    return false;
  }
}

/**
 * Checks if a user is an approved admin based on their email.
 * This is the first step before they can claim a code.
 * @param email The user's email.
 * @returns boolean
 */
export async function isApprovedAdmin(email: string): Promise<boolean> {
    try {
        const adminConfigRef = doc(db, 'config', 'admins');
        const adminConfigDoc = await getDoc(adminConfigRef);
        
        if (adminConfigDoc.exists()) {
            const approvedEmails = adminConfigDoc.data().emails || [];
            return approvedEmails.includes(email);
        }
        return false;
    } catch (error) {
        console.error("Error checking approved admin list:", error);
        return false;
    }
}
