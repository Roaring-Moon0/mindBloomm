
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { z } from 'zod';

const surveySchema = z.object({ name: z.string(), url:z.string().url() });

export const addSurvey = async (payload:z.infer<typeof surveySchema>)=>{
  const validated = surveySchema.parse(payload);
  await addDoc(collection(db,'surveys'),{ ...validated, createdAt: serverTimestamp(), visible:true });
};
export const updateSurvey = async (id:string, payload:Partial<z.infer<typeof surveySchema>>)=>{ await updateDoc(doc(db,'surveys',id), payload); };
export const deleteSurvey = async (id:string)=>{ await deleteDoc(doc(db,'surveys',id)); };
export const toggleSurveyVisibility = async (id:string, visible:boolean)=>{ await updateDoc(doc(db,'surveys',id), { visible }); };
