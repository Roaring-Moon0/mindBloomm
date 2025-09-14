
"use client";
import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useFirestoreCollection } from "@/hooks/use-firestore";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { Search, Youtube, AlertTriangle } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { searchYoutubeVideos } from "@/ai/flows/search-youtube-videos";
import type { YoutubeSearchOutput } from "@/ai/schemas/youtube-search";

interface CuratedVideo {
  id: string;
  name: string;
  url: string;
  thumbnail?: string;
  visible?: boolean;
}

// 🚫 Blocked keywords for safety
const BLOCKED_WORDS = [
  "suicide",
  "self harm",
  "how to die",
  "kill myself",
  "self-harm",
  "drug overdose",
  "overdose",
  "anorexia",
  "bulimia",
  "pro-ana",
  "pro-mia",
];

const containsBlockedWord = (query: string) => {
  const lowerCaseQuery = query.toLowerCase();
  return BLOCKED_WORDS.some((word) => lowerCaseQuery.includes(word));
};

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
  
    const { data: curatedVideos, loading: curatedLoading } =
      useFirestoreCollection<CuratedVideo>("videos");
  
    const [youtubeVideos, setYoutubeVideos] = useState<YoutubeSearchOutput['videos']>([]);
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isBlocked, setIsBlocked] = useState(false);
  
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const allCuratedVideos = useMemo(() => {
    const merged: Record<string, CuratedVideo[]> = {};
    Object.entries(categoriesData).forEach(([key, cat]) => {
      merged[key] = cat.videos;
    });

    (curatedVideos || [])
      .filter((v) => v.visible !== false)
      .forEach((video) => {
        if (!merged["extra"]) merged["extra"] = [];
        merged["extra"].push({
          ...video,
          thumbnail: `https://img.youtube.com/vi/${extractVideoId(video.url)}/hqdefault.jpg`,
        });
      });

    return merged;
  }, [curatedVideos]);

  useEffect(() => {
    const newUrl = debouncedSearchQuery ? `/resources?q=${encodeURIComponent(debouncedSearchQuery)}` : '/resources';
    // Use replace to avoid polluting browser history
    router.replace(newUrl, { scroll: false });
  
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
        const result = await searchYoutubeVideos({ query: debouncedSearchQuery });
        setYoutubeVideos(result.videos || []);
      } catch (err: any) {
        console.error("Error fetching YouTube data:", err);
        setError(err.message || "An unknown error occurred.");
        setYoutubeVideos([]);
      } finally {
        setIsSearching(false);
      }
    }
  
    fetchYoutubeVideos();
  }, [debouncedSearchQuery, router]);
  
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
  
  const showYoutubeResults = debouncedSearchQuery.trim() !== "";
  
  return (
      <FadeIn>
        <div className="container mx-auto py-12 px-4 md:px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight font-headline">
              Resource Library
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
              Explore our curated categories, or search YouTube for new content.
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
            <div className="text-center py-10 px-4 text-destructive bg-destructive/10 rounded-lg max-w-2xl mx-auto">
              <AlertTriangle className="mx-auto h-12 w-12" />
              <p className="mt-4 font-bold text-lg">
                For your safety, this search isn’t allowed.
              </p>
              <p className="text-sm text-destructive/80">
                Please try a different keyword. If you are in distress, please
                reach out to one of the emergency helplines.
              </p>
            </div>
          )}
  
          {!isBlocked && (
            <>
              {showYoutubeResults ? (
                <>
                  <h2 className="text-2xl font-bold font-headline mb-6">
                    YouTube Results for "{debouncedSearchQuery}"
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isSearching ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <VideoSkeleton key={i} />
                      ))
                    ) : youtubeVideos.length > 0 ? (
                      youtubeVideos.map((video) => (
                        <a
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
                        </a>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-20 text-muted-foreground">
                        <Youtube className="mx-auto h-16 w-16 mb-4" />
                        <p className="font-semibold">
                          No YouTube videos found for "{debouncedSearchQuery}".
                        </p>
                        <p className="text-sm">Please try a different search term.</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {curatedLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                       <div key={i} className="mb-12">
                        <Skeleton className="h-8 w-1/4 mb-6" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          <VideoSkeleton />
                          <VideoSkeleton />
                          <VideoSkeleton />
                        </div>
                      </div>
                    ))
                  ) : (
                    Object.entries(allCuratedVideos).map(([key, videos]) => (
                      <div key={key} className="mb-12">
                        <h2 className="text-2xl font-bold font-headline mb-6">
                          {categoriesData[key]?.name || "Extra Resources"}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {videos.map((video) => (
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
                                <CardContent className="flex-grow flex items-end">
                                  <p className="text-sm text-muted-foreground">
                                    Curated by MindBloom
                                  </p>
                                </CardContent>
                              </Card>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}
            </>
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
