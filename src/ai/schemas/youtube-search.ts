
import { z } from 'genkit';

export const YoutubeSearchInputSchema = z.object({
  query: z.string().describe('The search query for YouTube videos.'),
});

export const YoutubeSearchOutputSchema = z.object({
  videos: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      thumbnail: z.string(),
    })
  ).describe('A list of YouTube video search results.'),
});

export type YoutubeSearchInput = z.infer<typeof YoutubeSearchInputSchema>;
export type YoutubeSearchOutput = z.infer<typeof YoutubeSearchOutputSchema>;
