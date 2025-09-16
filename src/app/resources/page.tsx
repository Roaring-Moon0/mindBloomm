
"use client";
import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useFirestoreCollection } from "@/hooks/use-firestore";
import { useDebounce } from "@/hooks/use-debounce";
import { searchYoutubeVideos } from "@/ai/flows/search-youtube-videos";
import { Input } from "@/components/ui/input";
import { Search, Youtube, AlertTriangle } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import type { YoutubeSearchOutput } from "@/ai/schemas/youtube-search";

interface CuratedVideo {
  id: string;
  name: string;
  url: string;
  thumbnail?: string;
  visible?: boolean;
}

// 🔹 Helper: Extract YouTube ID from URL
const extractVideoId = (url: string) => {
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return match ? match[1] : "";
};

// 📌 Old curated categories with thumbnails
const categoriesData: Record<string, { name: string; videos: CuratedVideo[] }> = {
  anxiety: {
    name: "Anxiety Relief",
    videos: [
      {
        id: "1",
        name: "Guided Meditation for Anxiety & Stress",
        url: "https://www.youtube.com/watch?v=1dbYduxIpwE",
        thumbnail: "https://img.youtube.com/vi/1dbYduxIpwE/hqdefault.jpg",
      },
      {
        id: "2",
        name: "Yoga For Anxiety and Stress",
        url: "https://www.youtube.com/watch?v=hJbRpHZr_d0",
        thumbnail: "https://img.youtube.com/vi/hJbRpHZr_d0/hqdefault.jpg",
      },
      {
        id: "3",
        name: "Quick Anxiety Relief in 5 Minutes",
        url: "https://www.youtube.com/watch?v=MR57rug8NsM",
        thumbnail: "https://img.youtube.com/vi/MR57rug8NsM/hqdefault.jpg",
      },
    ],
  },
  depression: {
    name: "Depression Support",
    videos: [
      {
        id: "4",
        name: "How to Cope With Depression",
        url: "https://www.youtube.com/watch?v=EXB17cexyfQ",
        thumbnail: "https://img.youtube.com/vi/EXB17cexyfQ/hqdefault.jpg",
      },
      {
        id: "5",
        name: "Motivational Speech for Depression",
        url: "https://www.youtube.com/watch?v=U3nT2KDAGOc",
        thumbnail: "https://img.youtube.com/vi/U3nT2KDAGOc/hqdefault.jpg",
      },
    ],
  },
  sleep: {
    name: "Better Sleep",
    videos: [
      {
        id: "6",
        name: "Sleep Meditation Music",
        url: "https://www.youtube.com/watch?v=1ZYbU82GVz4",
        thumbnail: "https://img.youtube.com/vi/1ZYbU82GVz4/hqdefault.jpg",
      },
      {
        id: "7",
        name: "Guided Sleep Meditation",
        url: "https://www.youtube.com/watch?v=M0u9GST_j3s",
        thumbnail: "https://img.youtube.com/vi/M0u9GST_j3s/hqdefault.jpg",
      },
    ],
  },
  stress: {
    name: "Stress Management",
    videos: [
      {
        id: "8",
        name: "5-Minute Stress Relief",
        url: "https://www.youtube.com/watch?v=hnpQrMqDoqE",
        thumbnail: "https://img.youtube.com/vi/hnpQrMqDoqE/hqdefault.jpg",
      },
    ],
  },
  motivation: {
    name: "Motivation & Positivity",
    videos: [
      {
        id: "9",
        name: "Powerful Motivational Speech",
        url: "https://www.youtube.com/watch?v=mgmVOuLgFB0",
        thumbnail: "https://img.youtube.com/vi/mgmVOuLgFB0/hqdefault.jpg",
      },
    ],
  },
};


function ResourcesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
  
    const { data: curatedVideos, loading: curatedLoading, error: curatedError } =
      useFirestoreCollection<CuratedVideo>("videos");
  
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [searchResults, setSearchResults] = useState<YoutubeSearchOutput | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedSearchQuery) {
      setIsSearching(true);
      searchYoutubeVideos({ query: debouncedSearchQuery })
        .then(setSearchResults)
        .catch((err) => {
          console.error("YouTube search failed:", err);
          setSearchResults(null); // Clear results on error
        })
        .finally(() => setIsSearching(false));
    } else {
      setSearchResults(null);
    }
  }, [debouncedSearchQuery]);

  const allCuratedVideos = useMemo(() => {
    let allVideos: CuratedVideo[] = [];
    Object.values(categoriesData).forEach(cat => {
        allVideos = [...allVideos, ...cat.videos];
    });

    const firestoreVideos = (curatedVideos || [])
      .filter((v) => v.visible !== false)
      .map(video => ({
          ...video,
          thumbnail: `https://img.youtube.com/vi/${extractVideoId(video.url)}/hqdefault.jpg`,
        }));
        
    allVideos = [...allVideos, ...firestoreVideos];

    // Remove duplicates
    const uniqueVideos = allVideos.filter((video, index, self) =>
        index === self.findIndex((v) => v.url === video.url)
    );

    return uniqueVideos;
  }, [curatedVideos]);

  const filteredCuratedVideos = useMemo(() => {
    if (!searchQuery) {
        return allCuratedVideos;
    }
    return allCuratedVideos.filter(video => video.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [allCuratedVideos, searchQuery]);

  useEffect(() => {
    const newUrl = searchQuery ? `/resources?q=${encodeURIComponent(searchQuery)}` : '/resources';
    // Use replace to avoid polluting browser history
    router.replace(newUrl, { scroll: false });
  }, [searchQuery, router]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const VideoSkeleton = () => (
    <Card className="overflow-hidden">
      <Skeleton className="w-full h-48" />
      <CardContent className="p-4">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
  
  const showYoutubeResults = debouncedSearchQuery && (isSearching || searchResults);

  return (
      <FadeIn>
        <div className="container mx-auto py-12 px-4 md:px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight font-headline">
              Resource Library
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
              Explore our curated library of videos or search YouTube for more resources.
            </p>
          </div>
  
          <div className="max-w-xl mx-auto mb-12 flex gap-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for videos on YouTube..."
              className="bg-background pl-10"
            />
          </div>
  
          {showYoutubeResults && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 font-headline">YouTube Search Results for "{debouncedSearchQuery}"</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isSearching ? (
                   Array.from({ length: 3 }).map((_, i) => <VideoSkeleton key={i} />)
                ) : searchResults && searchResults.videos.length > 0 ? (
                  searchResults.videos.map((video) => (
                     <Link
                        href={`https://www.youtube.com/watch?v=${video.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={video.id}
                    >
                        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                        <div className="aspect-video relative">
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-lg leading-snug">
                            {video.title}
                            </CardTitle>
                        </CardHeader>
                        </Card>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10 text-muted-foreground">
                    <Youtube className="mx-auto h-12 w-12"/>
                    <p className="mt-4">No YouTube results found.</p>
                  </div>
                )}
              </div>
            </div>
          )}


          <h2 className="text-2xl font-bold mb-6 font-headline border-t pt-12">
            {searchQuery ? `Curated Results for "${searchQuery}"` : "Curated For You"}
          </h2>
          {curatedLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => <VideoSkeleton key={i} />)}
            </div>
          ) : curatedError ? (
            <div className="col-span-full text-center py-20 text-muted-foreground bg-destructive/10 rounded-lg">
                <AlertTriangle className="mx-auto h-16 w-16 mb-4 text-destructive" />
                <p className="font-semibold text-destructive">Could not load resources.</p>
                <p className="text-sm">There was an issue connecting to the database.</p>
            </div>
          ) : filteredCuratedVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCuratedVideos.map((video) => (
                    <Link
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={video.id}
                    >
                        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                        <div className="aspect-video relative">
                            {video.thumbnail ? (
                            <img
                                src={video.thumbnail}
                                alt={video.name}
                                className="object-cover w-full h-full"
                            />
                            ) : (
                            <div className="flex items-center justify-center bg-secondary w-full h-full">
                                <Youtube className="h-16 w-16 text-secondary-foreground/50" />
                            </div>
                            )}
                        </div>
                        <CardHeader>
                            <CardTitle className="text-lg leading-snug">
                            {video.name}
                            </CardTitle>
                        </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
          ) : (
             <div className="col-span-full text-center py-20 text-muted-foreground">
                <Youtube className="mx-auto h-16 w-16 mb-4" />
                <p className="font-semibold">
                  No curated videos found for "{searchQuery}".
                </p>
                <p className="text-sm">Please try a different search term or clear the search to see all curated videos.</p>
              </div>
          )}
        </div>
      </FadeIn>
  );
}

export default function ResourcesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResourcesContent />
    </Suspense>
  )
}
