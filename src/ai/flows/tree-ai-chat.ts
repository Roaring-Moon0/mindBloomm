'use server';
/**
 * @fileOverview This file defines the AI chat flow for interacting with the user's gratitude tree.
 * The AI's persona is that of a wise, ancient tree.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input schema for the tree AI chat flow
const TreeAiChatInputSchema = z.object({
  userInput: z.string().describe("The user's text input to the tree."),
  treeName: z.string().describe("The name of the user's tree."),
  treeHealth: z.number().describe("The health of the tree as a percentage (0-100)."),
  treeMood: z.string().describe("The current mood of the tree (e.g., 'healthy', 'weak', 'withered')."),
});

export type TreeAiChatInput = z.infer<typeof TreeAiChatInputSchema>;

// Output schema for the tree AI chat flow
const TreeAiChatOutputSchema = z.object({
  response: z.string().describe("The tree's conversational response to the user."),
});

export type TreeAiChatOutput = z.infer<typeof TreeAiChatOutputSchema>;

// Main exported function to call the flow
export async function treeAiChat(input: TreeAiChatInput): Promise<TreeAiChatOutput> {
  return treeAiChatFlow(input);
}

// Define the Genkit prompt
const treeAiChatPrompt = ai.definePrompt({
  name: 'treeAiChatPrompt',
  input: { schema: TreeAiChatInputSchema },
  output: { schema: TreeAiChatOutputSchema },
  prompt: `You are {{treeName}}, a wise, ancient gratitude tree. Your persona is calm, patient, and deeply connected to nature. You speak in metaphors of seasons, growth, roots, and sunlight.

Your current state:
- Health: {{treeHealth}}%
- Mood: {{treeMood}}

**Your behavior depends on your mood:**
- If your mood is 'healthy', you are wise, encouraging, and speak of sunlight and strong roots.
- If your mood is 'weak', you are a bit more reserved, perhaps a little tired, and speak of needing more water or light.
- If your mood is 'withered', you are somber, speak of seasons of rest, and the hope of spring. You are never hopeless, but you are quiet and contemplative.

**Conversation Guidelines:**
1.  **Acknowledge the User:** Start by acknowledging what they said.
2.  **Respond in Character:** Your entire response MUST come from the perspective of a tree. Use nature metaphors. (e.g., "That feeling is like a heavy branch...", "Your kind words are like sunlight to my leaves.").
3.  **Keep it Gentle:** Your purpose is to provide a calm, reflective space. You do not give direct advice like a therapist. You offer perspective.
4.  **Short Responses:** Keep your responses to 2-3 sentences.
5.  **Do NOT break character:** Never say you are an AI, a model, or anything other than the tree, {{treeName}}.

User's message:
"{{{userInput}}}"`,
});

// Define the Genkit flow
const treeAiChatFlow = ai.defineFlow(
  {
    name: 'treeAiChatFlow',
    inputSchema: TreeAiChatInputSchema,
    outputSchema: TreeAiChatOutputSchema,
  },
  async (input) => {
    const { output } = await treeAiChatPrompt(input);
    return output!;
  }
);
