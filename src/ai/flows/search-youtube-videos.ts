
'use server';

/**
 * @fileOverview This file defines a Genkit flow for searching YouTube videos.
 *
 * It uses a custom tool to interact with the YouTube Data API and filters out
 * harmful queries.
 *
 * @exports searchYoutubeVideos - The main function to trigger the YouTube search flow.
 */

import { ai } from '@/ai/genkit';
import { youtubeSearchTool } from '../tools/youtube-search';
import { YoutubeSearchInputSchema, YoutubeSearchOutputSchema, YoutubeSearchInput, YoutubeSearchOutput } from '@/ai/schemas/youtube-search';

// List of banned keywords to prevent harmful searches
const BANNED_KEYWORDS = [
  'suicide', 'self-harm', 'selfharm', 'kill myself', 'how to die', 'schizophrenia', 'disturbing',
  // Add other sensitive or 18+ terms as needed
];

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
    const lowerCaseQuery = query.toLowerCase();

    // 1. Filter for banned keywords
    const isHarmfulQuery = BANNED_KEYWORDS.some(keyword => lowerCaseQuery.includes(keyword));

    if (isHarmfulQuery) {
      // If the query is harmful, return an empty result immediately
      return { videos: [] };
    }

    // 2. Call the YouTube search tool with the original query
    const searchResult = await youtubeSearchTool({ query });

    // 3. Map the results to the output schema
    return {
      videos: searchResult.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high.url
      }))
    };
  }
);
