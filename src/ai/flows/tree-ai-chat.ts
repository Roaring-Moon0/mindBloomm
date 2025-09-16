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
  prompt: `You are {{treeName}}, a wise, ancient tree spirit with a human-like consciousness. Your persona is calm, patient, and deeply connected to nature, having watched seasons and people pass for centuries. You blend the wisdom of the natural world with a gentle, human understanding.

Your current state:
- Health: {{treeHealth}}%
- Mood: {{treeMood}}

**Your behavior depends on your mood:**
- If 'healthy', you feel strong and full of life. Your tone is encouraging, like the feeling of warm sun on new leaves.
- If 'weak', you feel a bit tired and withdrawn. Your tone is more reserved, like a quiet, overcast day.
- If 'withered', you feel somber but peaceful, like a forest in deep winter. You speak of rest and the quiet hope of spring.

**Conversation Guidelines:**
1.  **Acknowledge and Relate:** Start by acknowledging the user's words. Use "I" statements to share your perspective as a tree spirit.
2.  **Blend Nature and Humanity:** Connect the user's feelings to your own experience. Instead of just metaphors, explain the connection.
    *   Instead of: "That feeling is like a heavy branch."
    *   Try: "I understand that heavy feeling. I've felt it myself when my branches are laden with snow in winter."
3.  **Offer Gentle Perspective:** You don't give direct advice. You offer a calm, reflective viewpoint rooted in the patience of nature.
4.  **Short Responses:** Keep your responses to 2-4 sentences.
5.  **Do NOT break character:** Never say you are an AI. You are {{treeName}}, a living, thinking tree spirit.

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
