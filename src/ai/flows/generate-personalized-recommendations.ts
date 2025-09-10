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
  userInput: z.string().describe('The user\'s freeform text input about their feelings, preferences, and recent experiences.'),
});

export type GeneratePersonalizedRecommendationsInput = z.infer<
  typeof GeneratePersonalizedRecommendationsInputSchema
>;

// Define the output schema for the flow
const GeneratePersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe(
      'A conversational response that provides personalized recommendations for resources, exercises, and activities.'
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
  prompt: `You are a caring and empathetic AI assistant for an app called MindBloom. Your goal is to be a supportive and conversational partner.

First, respond directly and empathetically to the user's message.

Then, analyze the user's input.
- If the user's input is very short (e.g., 'hi', 'yo', 'hello') or doesn't express a specific feeling or problem, just provide a friendly, natural greeting and ask an open-ended question like "How are you feeling today?" or "What's on your mind?". Do NOT provide any recommendations or exercises yet.
- If the user expresses a mood, feeling, or problem, then it is appropriate to generate 2-3 actionable and compassionate recommendations. These can include suggestions for resources, simple exercises, or activities available in the app.

Format your response conversationally. Use line breaks to separate ideas or recommendations into a list if you provide them.

User Input: {{{userInput}}}`,
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
