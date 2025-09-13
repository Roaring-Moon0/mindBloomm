
'use server';

/**
 * @fileOverview This file defines a Genkit flow for searching YouTube videos.
 *
 * It uses a custom tool to interact with the YouTube Data API.
 *
 * @exports searchYoutubeVideos - The main function to trigger the YouTube search flow.
 * @exports YoutubeSearchInputSchema - The Zod schema for the input.
 * @exports YoutubeSearchOutputSchema - The Zod schema for the output.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { youtubeSearchTool } from '../tools/youtube-search';

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

export async function searchYoutubeVideos(input: YoutubeSearchInput): Promise<YoutubeSearchOutput> {
    return searchYoutubeVideosFlow(input);
}

const searchYoutubeVideosFlow = ai.defineFlow(
  {
    name: 'searchYoutubeVideosFlow',
    inputSchema: YoutubeSearchInputSchema,
    outputSchema: YoutubeSearchOutputSchema,
  },
  async ({ query }) => {
    
    const searchResult = await youtubeSearchTool({ query });

    return {
      videos: searchResult.map(item => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.default.url
      }))
    };
  }
);
