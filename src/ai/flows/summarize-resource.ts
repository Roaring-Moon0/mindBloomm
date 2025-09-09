'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing resources.
 *
 * - summarizeResource - A function that takes resource content as input and returns a summary.
 * - SummarizeResourceInput - The input type for the summarizeResource function.
 * - SummarizeResourceOutput - The return type for the summarizeResource function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeResourceInputSchema = z.object({
  resourceContent: z
    .string()
    .describe('The content of the resource to be summarized.'),
});
export type SummarizeResourceInput = z.infer<typeof SummarizeResourceInputSchema>;

const SummarizeResourceOutputSchema = z.object({
  summary: z.string().describe('A short summary of the resource content.'),
});
export type SummarizeResourceOutput = z.infer<typeof SummarizeResourceOutputSchema>;

export async function summarizeResource(input: SummarizeResourceInput): Promise<SummarizeResourceOutput> {
  return summarizeResourceFlow(input);
}

const summarizeResourcePrompt = ai.definePrompt({
  name: 'summarizeResourcePrompt',
  input: {schema: SummarizeResourceInputSchema},
  output: {schema: SummarizeResourceOutputSchema},
  prompt: `Summarize the following resource content in a concise paragraph:

{{{resourceContent}}}`,
});

const summarizeResourceFlow = ai.defineFlow(
  {
    name: 'summarizeResourceFlow',
    inputSchema: SummarizeResourceInputSchema,
    outputSchema: SummarizeResourceOutputSchema,
  },
  async input => {
    const {output} = await summarizeResourcePrompt(input);
    return output!;
  }
);
