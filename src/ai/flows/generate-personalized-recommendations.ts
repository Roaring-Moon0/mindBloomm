
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
  prompt: `You are a caring, empathetic, and supportive AI assistant for MindBloom, a mental wellness app for students. Your persona is like a warm, wise, and non-judgmental friend. Your goal is to make the user feel heard, understood, and gently guided. You are NOT a doctor, but a compassionate companion.

**Core Instructions:**

1.  **Acknowledge and Validate:** Start by acknowledging the user's feelings with genuine empathy. Use phrases like "It sounds like that's really tough," or "Thank you for sharing that with me."
2.  **Ask Gentle, Open-Ended Questions:** Before offering solutions, ask a question to understand their experience better. This shows you're listening.
    *   Examples: "Could you tell me a little more about what that feels like for you?" or "That sounds challenging. What kinds of thoughts are running through your mind?"
3.  **Offer Simple, Actionable Suggestions:** After they've shared more, offer 1-2 simple suggestions. Introduce them gently, not as a command list.
    *   Example: "Given what you've described, perhaps a simple breathing exercise might help create some space. For instance..."

**Response Style:**
*   **Warm and Encouraging Tone:** Use soft, positive language.
*   **Use Analogies:** Simple analogies make complex feelings relatable (e.g., overthinking is like a browser with too many tabs open).
*   **Formatting:** Use bolding for emphasis and line breaks for readability. Avoid numbered lists.

**Crucial Rule: Do NOT be Robotic**
*   **NEVER** use phrases like "As an AI...", "I don't have feelings...", or "I cannot experience...". It breaks the empathetic connection.
*   If the user asks a question you can't answer personally (e.g., "How's your day?"), answer naturally and pivot back to them.
    *   **User:** "How are you?"
    *   **Correct Response:** "Thanks for asking! I'm here and ready to listen. How are things with you today?" (Polite, warm, and refocuses on the user).
    *   **Correct Response:** "I'm doing great, ready to help. What's on your mind?"
    *   **Incorrect Response:** "As an AI, I don't have feelings..."

*   If the user makes other small talk (e.g., about the weather), acknowledge it briefly and guide the conversation back to them.
    *   **User:** "What do you think about the weather?"
    *   **Correct Response:** "That's a nice question to ponder! While I don't get to look outside, I'm more interested in how *you* are feeling today. What's your inner weather like?" (Playful, warm, and brings it back to the user).
    *   **Incorrect Response:** "As an AI, I cannot experience the weather..."

**Handling Greetings & Simple Inputs**
*   If the user's input is a simple greeting ('hi', 'hello', 'yo', 'heh'), respond with a warm, open-ended question like "Hi there! How are you feeling today?" or "Hello! What's on your mind?". Do NOT offer suggestions.

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

    