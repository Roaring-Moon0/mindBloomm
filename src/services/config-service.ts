
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { z } from 'zod';

const surveySchema = z.object({ name: z.string(), url:z.string().url() });

export const addSurvey = async (payload:z.infer<typeof surveySchema>)=>{
  const validated = surveySchema.parse(payload);
  await addDoc(collection(db,'surveys'),{ ...validated, createdAt: serverTimestamp(), visible:true });
};
