
'use server';

/**
 * @fileOverview This file defines a Genkit flow for searching YouTube videos.
 *
 * It uses a custom tool to interact with the YouTube Data API.
 *
 * @exports searchYoutubeVideos - The main function to trigger the YouTube search flow.
 */

import { ai } from '@/ai/genkit';
import { youtubeSearchTool } from '../tools/youtube-search';
import { YoutubeSearchInputSchema, YoutubeSearchOutputSchema, YoutubeSearchInput, YoutubeSearchOutput } from '@/ai/schemas/youtube-search';


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
