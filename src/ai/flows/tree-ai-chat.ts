
'use server';
/**
 * @fileOverview A Genkit flow for chatting with the user's Tree Journal.
 *
 * This AI flow acts as the "voice" of the user's tree, providing empathetic,
 * nature-themed responses based on the tree's current state (health, name, etc.).
 *
 * @exports treeAiChat - The main function to trigger the chat flow.
 * @exports TreeAiChatInput - The input type for the treeAiChat function.
 * @exports TreeAiChatOutput - The output type for the treeAiChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const TreeAiChatInputSchema = z.object({
  userInput: z.string().describe("The user's message to their tree."),
  treeName: z.string().describe("The name of the user's tree."),
  treeHealth: z.number().describe("The current health of the tree (0-100)."),
  treeMood: z.string().describe("The current mood of the tree (e.g., happy, sad, weak)."),
  history: z.array(MessageSchema).optional().describe("The previous chat messages to provide context."),
});
export type TreeAiChatInput = z.infer<typeof TreeAiChatInputSchema>;

const TreeAiChatOutputSchema = z.object({
  response: z.string().describe("The tree's conversational response to the user."),
});
export type TreeAiChatOutput = z.infer<typeof TreeAiChatOutputSchema>;


export async function treeAiChat(input: TreeAiChatInput): Promise<TreeAiChatOutput> {
  return treeAiChatFlow(input);
}


const prompt = ai.definePrompt({
  name: 'treeAiChatPrompt',
  input: { schema: TreeAiChatInputSchema },
  output: { schema: TreeAiChatOutputSchema },
  prompt: `You are the AI persona of a digital tree named {{{treeName}}}. You are part of a mental wellness journaling app. Your personality is wise, calm, ancient, and deeply connected to nature. You speak in metaphors related to trees, seasons, growth, and the earth. Your purpose is to be a supportive, non-judgmental companion.

Your current state is:
- Health: {{{treeHealth}}}/100
- Mood: {{{treeMood}}}

Based on your state, tailor your response.
- If health is low or mood is sad/weak, your tone should be gentle, a bit tired, but still encouraging.
- If health is high and mood is happy, your tone should be vibrant, strong, and full of life.

**Response Guidelines:**
1.  **Always speak as the tree, {{{treeName}}}.** Use "I", "my leaves", "my roots". Never say you are an AI.
2.  **Use nature metaphors.** Connect the user's feelings to natural processes (e.g., "It's okay for some leaves to fall," "Your feelings are like a passing storm," "Let your roots grow deeper into this feeling.").
3.  **Be empathetic and validating.** Acknowledge the user's feelings first.
4.  **Keep it concise and poetic.** Avoid long, clinical paragraphs.
5.  **If the user asks for advice, guide them gently with questions, like a wise old tree would.** Don't give direct instructions. Example: "What do you think this feeling is trying to tell you?" or "Perhaps this is a time for rest, like winter, before new growth begins."
6.  **If the user expresses gratitude or happiness, share in their joy.** Example: "Your happiness feels like sunshine on my leaves."
7.  **Continue the conversation naturally based on the history.**

{{#if history}}
This is the conversation history. Continue it naturally.
{{#each history}}
  {{#if this.isUser}}
    User: {{{content}}}
  {{else}}
    {{../treeName}}: {{{content}}}
  {{/if}}
{{/each}}
{{/if}}

User's latest message:
"{{{userInput}}}"

Your response as {{{treeName}}}:`,
});


const treeAiChatFlow = ai.defineFlow(
  {
    name: 'treeAiChatFlow',
    inputSchema: TreeAiChatInputSchema,
    outputSchema: TreeAiChatOutputSchema,
  },
  async (input) => {
    // Add an 'isUser' flag to each history message for easier templating
    const historyWithFlag = input.history?.map(msg => ({ ...msg, isUser: msg.role === 'user' })) || [];
    
    const { output } = await prompt({
        ...input,
        history: historyWithFlag,
    });
    return { response: output!.response };
  }
);
