// src/ai/flows/generate-personalized-recommendations.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized mental health recommendations.
 *
 * The flow takes user mood, preferences, and tracked data as input and returns tailored suggestions
 * for resources, exercises, and activities.
 *
 * @exports {generatePersonalizedRecommendations} - The main function to trigger the recommendation flow.
 * @exports {GeneratePersonalizedRecommendationsInput} - The input type for the generatePersonalizedRecommendations function.
 * @exports {GeneratePersonalizedRecommendationsOutput} - The output type for the generatePersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the flow
const GeneratePersonalizedRecommendationsInputSchema = z.object({
  mood: z
    .string()
    .describe('The current mood of the user (e.g., happy, sad, anxious).'),
  preferences: z
    .string()
    .describe(
      'The user preferences for mental health resources (e.g., meditation, exercise, reading).'
    ),
  trackedData: z
    .string()
    .describe(
      'The user tracked data, including sleep patterns, activity levels, and app usage.'
    ),
});

export type GeneratePersonalizedRecommendationsInput = z.infer<
  typeof GeneratePersonalizedRecommendationsInputSchema
>;

// Define the output schema for the flow
const GeneratePersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe(
      'A list of personalized recommendations for resources, exercises, and activities.'
    ),
});

export type GeneratePersonalizedRecommendationsOutput = z.infer<
  typeof GeneratePersonalizedRecommendationsOutputSchema
>;

// Define the main function to trigger the flow
export async function generatePersonalizedRecommendations(
  input: GeneratePersonalizedRecommendationsInput
): Promise<GeneratePersonalizedRecommendationsOutput> {
  return generatePersonalizedRecommendationsFlow(input);
}

// Define the prompt
const personalizedRecommendationsPrompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: GeneratePersonalizedRecommendationsInputSchema},
  output: {schema: GeneratePersonalizedRecommendationsOutputSchema},
  prompt: `Based on the user's current mood, preferences, and tracked data, generate personalized recommendations for mental health resources, exercises, and activities.

User Mood: {{{mood}}}
User Preferences: {{{preferences}}}
Tracked Data: {{{trackedData}}}

Recommendations:`,
});

// Define the Genkit flow
const generatePersonalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedRecommendationsFlow',
    inputSchema: GeneratePersonalizedRecommendationsInputSchema,
    outputSchema: GeneratePersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await personalizedRecommendationsPrompt(input);
    return output!;
  }
);
