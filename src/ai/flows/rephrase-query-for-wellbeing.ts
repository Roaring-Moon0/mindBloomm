
'use server';

/**
 * @fileOverview This file defines a Genkit flow for rephrasing a search query
 * to be more suitable for mental well-being and positive content.
 *
 * @exports rephraseQueryForWellbeing - The main function to trigger the rephrasing flow.
 * @exports RephraseQueryInput - The input type for the rephraseQueryForWellbeing function.
 * @exports RephraseQueryOutput - The output type for the rephraseQueryForWellbeing function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RephraseQueryInputSchema = z.object({
  originalQuery: z.string().describe('The original user-provided search query.'),
});
export type RephraseQueryInput = z.infer<typeof RephraseQueryInputSchema>;

const RephraseQueryOutputSchema = z.object({
  rephrasedQuery: z.string().describe('The rephrased search query optimized for positive and supportive content.'),
});
export type RephraseQueryOutput = z.infer<typeof RephraseQueryOutputSchema>;


export async function rephraseQueryForWellbeing(input: RephraseQueryInput): Promise<RephraseQueryOutput> {
  return rephraseQueryFlow(input);
}


const rephraseQueryPrompt = ai.definePrompt({
  name: 'rephraseQueryPrompt',
  input: { schema: RephraseQueryInputSchema },
  output: { schema: RephraseQueryOutputSchema },
  prompt: `You are an AI assistant for a mental wellness app. Your task is to take a user's search query and rephrase it to find supportive, calming, and positive content on YouTube. Avoid queries that could lead to disturbing, sensationalized, or pathologizing content.

**Goal:** Transform the user's topic into a search for its benefits for mental health, relaxation, or mindfulness.

**Examples:**
- Original: "minecraft"
  Rephrased: "relaxing Minecraft gameplay for stress relief"
- Original: "gaming"
  Rephrased: "positive mental health benefits of gaming"
- Original: "social media"
  Rephrased: "how to use social media mindfully for positive connections"
- Original: "sad songs"
  Rephrased: "calming and uplifting ambient music"
- Original: "anxiety"
  Rephrased: "guided meditation for anxiety relief"
- Original: "ASMR"
  Rephrased: "ASMR for sleep and relaxation"

**Original Query:**
{{{originalQuery}}}
`,
});


const rephraseQueryFlow = ai.defineFlow(
  {
    name: 'rephraseQueryFlow',
    inputSchema: RephraseQueryInputSchema,
    outputSchema: RephraseQueryOutputSchema,
  },
  async (input) => {
    const { output } = await rephraseQueryPrompt(input);
    return output!;
  }
);
