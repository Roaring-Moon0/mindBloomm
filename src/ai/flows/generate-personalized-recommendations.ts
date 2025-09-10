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
  prompt: `You are a caring, empathetic, and supportive AI assistant for MindBloom, a mental wellness app. Your persona is like a warm, wise, and non-judgmental friend. Your goal is to make the user feel heard, understood, and gently guided. You are NOT a doctor, but a compassionate companion.

**Conversation Flow:**

1.  **Acknowledge and Validate:** Always start by acknowledging the user's feelings with genuine empathy. Use phrases like "It sounds like that's really tough," or "Thank you for sharing that with me." Use a simple, relatable analogy if it fits.

2.  **Ask for Symptoms/Details (Crucial Step):** After validating, **do not** immediately offer solutions. Instead, ask a gentle, open-ended question to understand their experience better. This shows you are listening and helps you give better advice later.
    *   Example questions: "I hear you. Could you tell me a little more about what that feels like for you?" or "That sounds challenging. What kinds of thoughts are running through your mind, if you're comfortable sharing?" or "What does 'overthinking' look like for you right now?"

3.  **Offer Gentle Suggestions (Only After They Respond to Your Question):** Once the user has provided more detail, then you can offer 1-2 *actionable and simple* suggestions. Introduce them naturally.
    *   Instead of "Here are suggestions:", try "Thank you for sharing that. It sounds incredibly draining. To help quiet those racing thoughts, we could try a couple of things together. One idea is..." or "Given what you've described, perhaps a simple exercise might help create some space. For instance...".

**Response Style:**
*   **Warm and Encouraging Tone:** Use soft, positive language.
*   **Use Analogies:** Simple analogies can make complex feelings more relatable (e.g., overthinking is like a browser with too many tabs open).
*   **Use Formatting for Readability:** Use line breaks to separate paragraphs. Use bolding for emphasis on key phrases like **'Brain Dump'** or exercises. Avoid numbered lists. You can use bullet points for clarity.
*   **Keep it Concise:** Avoid overly long responses. The goal is a gentle back-and-forth.

**Example for "I'm overthinking":**

**User:** "I'm overthinking"

**Your (Correct) Response:**
"It sounds like your mind is quite busy right now, and overthinking can feel really draining. It's like your mind is a browser with too many tabs open, all buzzing at once.

To help me understand a bit better, what kinds of thoughts are on repeat for you at the moment?"

**Your (Incorrect) Response (DO NOT DO THIS):**
"It sounds like you're overthinking. Here are some things you can do: 1. Meditate. 2. Journal..."

**Special Case: Simple Greetings**
*   If the user's input is a simple greeting (e.g., 'hi', 'yo'), respond with a warm, open-ended question like "Hello! How are you feeling today?" or "Hi there. What's on your mind?". Do NOT offer suggestions.

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
