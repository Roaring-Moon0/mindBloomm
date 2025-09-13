
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const YoutubeSearchToolInputSchema = z.object({
  query: z.string(),
});

const YoutubeSearchToolOutputSchema = z.any();


export const youtubeSearchTool = ai.defineTool(
    {
        name: 'youtubeSearchTool',
        description: 'Searches YouTube for videos based on a query.',
        inputSchema: YoutubeSearchToolInputSchema,
        outputSchema: YoutubeSearchToolOutputSchema,
    },
    async ({ query }) => {
        const apiKey = process.env.YOUTUBE_API_KEY;
        if (!apiKey) {
            throw new Error('YOUTUBE_API_KEY environment variable not set.');
        }

        const url = new URL('https://www.googleapis.com/youtube/v3/search');
        url.searchParams.append('part', 'snippet');
        url.searchParams.append('q', query);
        url.searchParams.append('type', 'video');
        url.searchParams.append('maxResults', '9');
        url.searchParams.append('key', apiKey);

        try {
            const response = await fetch(url.toString());
            if (!response.ok) {
                const errorBody = await response.json();
                console.error('YouTube API Error:', errorBody);
                throw new Error(`YouTube API request failed with status ${response.status}`);
            }
            const data = await response.json();
            return data.items;
        } catch (error) {
            console.error('Error fetching from YouTube API:', error);
            throw new Error('Failed to fetch videos from YouTube.');
        }
    }
);
