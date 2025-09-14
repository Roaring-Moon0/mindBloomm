
"use client";
import { useEffect, useState } from "react";
import { useFirestoreCollection } from "@/hooks/use-firestore";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { Search, Youtube, AlertTriangle } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';

interface CuratedVideo {
    id: string;
    name: string;
    url: string;
    visible?: boolean;
}

const BLOCKED_WORDS = [
    'suicide', 'self harm', 'how to die', 'kill myself', 'self-harm',
    'drug overdose', 'overdose', 'anorexia', 'bulimia', 'pro-ana', 'pro-mia'
];

const containsBlockedWord = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    return BLOCKED_WORDS.some(word => lowerCaseQuery.includes(word));
};

export default function ResourcesPage() {
  const { data: curatedVideos, loading: curatedLoading } = useFirestoreCollection<CuratedVideo>('videos');
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const visibleCuratedVideos = (curatedVideos || []).filter(v => v.visible !== false);

  useEffect(() => {
    async function fetchYoutubeVideos() {
      if (debouncedSearchQuery.trim() === "") {
        setYoutubeVideos([]);
        setIsSearching(false);
        setIsBlocked(false);
        setError(null);
        return;
      }
      
      if (containsBlockedWord(debouncedSearchQuery)) {
        setIsBlocked(true);
        setYoutubeVideos([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      setIsBlocked(false);
      setError(null);

      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            debouncedSearchQuery
          )}&type=video&maxResults=9&key=${
            process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
          }`
        );
        if (!res.ok) {
           throw new Error('Failed to fetch videos from YouTube.');
        }
        const data = await res.json();
        setYoutubeVideos(data.items || []);
      } catch (err: any) {
        console.error("Error fetching YouTube data:", err);
        setError(err.message || 'An unknown error occurred.');
        setYoutubeVideos([]);
      } finally {
        setIsSearching(false);
      }
    }

    fetchYoutubeVideos();
  }, [debouncedSearchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }

  const VideoSkeleton = () => (
    <Card className="overflow-hidden">
        <Skeleton className="w-full h-48" />
        <CardContent className="p-4">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
        </CardContent>
    </Card>
  )
  
  const showYoutubeResults = debouncedSearchQuery.trim() !== "";

  return (
    <FadeIn>
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold tracking-tight font-headline">Resource Library</h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    Explore our curated library of videos, or search YouTube for topics like 'meditation' or 'mindfulness'.
                </p>
            </div>

            <div className="max-w-xl mx-auto mb-12 flex gap-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search all videos on YouTube..."
                    className="bg-background pl-10"
                />
            </div>

            {isBlocked && (
                <div className="text-center py-10 px-4 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg max-w-2xl mx-auto">
                    <AlertTriangle className="mx-auto h-12 w-12"/>
                    <p className="mt-4 font-bold text-lg">For your safety, this search isn’t allowed.</p>
                    <p className="text-sm">Please try a different keyword. If you are in distress, please reach out to one of the emergency helplines.</p>
                </div>
            )}
            
            {!isBlocked && (
                <>
                <h2 className="text-2xl font-bold font-headline mb-6">{showYoutubeResults ? `YouTube Results for "${debouncedSearchQuery}"` : "Our Curated Library"}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isSearching ? (
                    Array.from({length: 6}).map((_, i) => <VideoSkeleton key={i}/>)
                ) : showYoutubeResults ? (
                    youtubeVideos.length > 0 ? (
                        youtubeVideos.map((video) => (
                           <a href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer" key={video.id.videoId}>
                               <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                                    <div className="aspect-video relative">
                                        <img src={video.snippet.thumbnails.high.url} alt={video.snippet.title} className="object-cover w-full h-full" />
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-lg leading-snug">{video.snippet.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow flex items-end">
                                        <p className="text-sm text-muted-foreground">By {video.snippet.channelTitle}</p>
                                    </CardContent>
                                </Card>
                            </a>
                        ))
                    ) : (
                         <div className="col-span-full text-center py-20 text-muted-foreground">
                            <Youtube className="mx-auto h-16 w-16 mb-4"/>
                            <p className="font-semibold">No YouTube videos found for "{debouncedSearchQuery}".</p>
                            <p className="text-sm">Please try a different search term.</p>
                        </div>
                    )
                ) : (
                    curatedLoading ? (
                        Array.from({length: 3}).map((_, i) => <VideoSkeleton key={i}/>)
                    ) : (
                         visibleCuratedVideos.map(video => (
                            <Link href={video.url} target="_blank" rel="noopener noreferrer" key={video.id}>
                               <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                                     <div className="aspect-video relative flex items-center justify-center bg-secondary">
                                        <Youtube className="h-16 w-16 text-secondary-foreground/50"/>
                                     </div>
                                    <CardHeader>
                                        <CardTitle className="text-lg leading-snug">{video.name}</CardTitle>
                                    </CardHeader>
                                     <CardContent className="flex-grow flex items-end">
                                        <p className="text-sm text-muted-foreground">Curated by MindBloom</p>
                                     </CardContent>
                                </Card>
                            </Link>
                        ))
                    )
                )}
                </div>
                </>
            )}
        </div>
    </FadeIn>
  );
}
