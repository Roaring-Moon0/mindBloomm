
"use client";

import { useState, useMemo, useEffect, useTransition } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Youtube,
  FileText,
  RefreshCw,
  Search,
  Music,
  Loader2,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FadeIn } from "@/components/ui/fade-in";
import { useFirestoreCollection } from "@/hooks/use-firestore";
import { searchYoutubeVideos, YoutubeSearchOutput } from "@/ai/flows/search-youtube-videos";
import { useDebounce } from "@/hooks/use-debounce";

// 🌟 Categories
const categoriesData: Record<
  string,
  {
    name: string;
    description: string;
    videos?: { id: string; title: string; url: string }[];
    audios?: { id:string; title: string; url: string }[];
    articles?: { id: string; title: string; url: string }[];
  }
> = {
  anxiety: {
    name: "Anxiety Relief",
    description: "Techniques and resources to calm your mind and manage anxiety.",
    videos: [
      { id: "1dbYduxIpwE", title: "Guided Meditation for Anxiety & Stress", url: "https://www.youtube.com/embed/1dbYduxIpwE" },
      { id: "hJbRpHZr_d0", title: "Yoga For Anxiety and Stress", url: "https://www.youtube.com/embed/hJbRpHZr_d0" },
      { id: "MR57rug8NsM", title: "Quick Anxiety Relief in 5 Minutes", url: "https://www.youtube.com/embed/MR57rug8NsM" },
      { id: "O-6f5wQXSu8", title: "How to Stop an Anxiety Attack", url: "https://www.youtube.com/embed/O-6f5wQXSu8" },
    ],
    audios: [
      { id: "79kpoGF8KWU", title: "Calming Music for Anxiety & Stress", url: "https://www.youtube.com/embed/79kpoGF8KWU" },
      { id: "Nv07q-SFgNc", title: "Solfeggio Frequency for Anxiety", url: "https://www.youtube.com/embed/Nv07q-SFgNc" },
    ],
    articles: [],
  },
  depression: {
    name: "Overcoming Depression",
    description: "A gentle guide to understanding and coping with depression.",
    videos: [
        { id: "fWFuQR_Wt4M", title: "What is depression?", url: "https://www.youtube.com/embed/fWFuQR_Wt4M" },
        { id: "ngvOyccUzzY", title: "How to get stuff done when you are depressed", url: "https://www.youtube.com/embed/ngvOyccUzzY" },
        { id: "5If1LFZ1CQA", title: "A Self-Care Action Plan for Depression", url: "https://www.youtube.com/embed/5If1LFZ1CQA" },
        { id: "XiCrniLQGYc", title: "Animated Video on Overcoming Depression", url: "https://www.youtube.com/embed/XiCrniLQGYc" }
    ],
    audios: [
      { id: "OesMEEalJho", title: "Uplifting Music to Boost Your Mood", url: "https://www.youtube.com/embed/OesMEEalJho" },
    ],
    articles: [],
  },
  sleep: {
    name: "Better Sleep",
    description: "Improve your sleep hygiene and get the rest you deserve.",
    videos: [
        { id: "gBHLMkBnWB8", title: "Sleep Hypnosis to Fall Asleep Easily", url: "https://www.youtube.com/embed/gBHLMkBnWB8" },
        { id: "8S4WOgXyQMo", title: "Bedtime Yoga", url: "https://www.youtube.com/embed/8S4WOgXyQMo" },
        { id: "4WASgOyGjjQ", title: "Unlock Better Sleep", url: "https://www.youtube.com/embed/4WASgOyGjjQ" },
    ],
    audios: [
      { id: "GGj4eSixfJk", title: "Deep Sleep Music, Insomnia, Relaxing Music", url: "https://www.youtube.com/embed/rCSCPujLs14" },
      { id: "eTeD8DAta4c", title: "Rain Sounds for Sleeping", url: "https://www.youtube.com/embed/eTeD8DAta4c" },
    ],
    articles: [],
  },
  stress: {
    name: "Understanding Stress",
    description: "Learn about the causes of stress and effective solutions.",
    videos: [
        { id: "v-t1Z5-oPtU", title: "How stress affects your body", url: "https://www.youtube.com/embed/v-t1Z5-oPtU" },
        { id: "RcGyVTAoXEU", title: "How to make stress your friend", url: "https://www.youtube.com/embed/RcGyVTAoXEU" },
        { id: "z6X5oEIg6Ak", title: "10-Minute Meditation For Stress", url: "https://www.youtube.com/embed/z6X5oEIg6Ak" },
    ],
    audios: [
      { id: "rCSCPujLs14", title: "3 Hours of Relaxing Music for Stress Relief", url: "https://www.youtube.com/embed/rCSCPujLs14" },
    ],
    articles: [],
  },
  motivational: {
    name: "Motivational",
    description: "Inspiring talks and content to lift your spirits.",
    videos: [
      { id: "Cw6xuzosn4s", title: "The Psychology of a Winner - Motivational Speech", url: "https://www.youtube.com/embed/Cw6xuzosn4s" },
      { id: "4x7MkLDGnu8", title: "How to Stop Procrastinating", url: "https://www.youtube.com/embed/4x7MkLDGnu8" },
    ],
    audios: [
      { id: "3sK3wJAxGfs", title: "Inspirational Talk on Resilience", url: "https://www.youtube.com/embed/3sK3wJAxGfs" },
    ],
    articles: [],
  },
};


// 🌟 Quotes
const allQuotes = [
  {
    quote: "The best way to predict the future is to create it.",
    author: "Peter Drucker",
  },
  {
    quote:
      "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis",
  },
  {
    quote: "The journey of a thousand miles begins with a single step.",
    author: "Lao Tzu",
  },
  {
    quote:
      "What you get by achieving your goals is not as important as what you become by achieving your goals.",
    author: "Zig Ziglar",
  },
];

// 🌟 Video Card
function VideoCard({ title, videoId, url }: { title: string; videoId?: string; url?: string; }) {
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` :
    (url && url.includes('youtube.com/watch?v=')) ? url.replace('watch?v=', 'embed/') : url;

  if (!embedUrl) return null;

  return (
    <Card className="bg-gradient-to-br from-pink-200/60 via-purple-200/60 to-blue-200/60 rounded-2xl shadow-lg hover:scale-[1.03] hover:shadow-2xl transition-all">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground text-center">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video rounded-xl overflow-hidden shadow-inner">
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}

// 🌟 Quote Display
function QuoteDisplay() {
  const [quoteIndex, setQuoteIndex] = useState<number | null>(null);

  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * allQuotes.length));
  }, []);

  const handleChangeQuote = () => {
    setQuoteIndex((prev) =>
      prev !== null ? (prev + 1) % allQuotes.length : 0
    );
  };

  const currentQuote = quoteIndex !== null ? allQuotes[quoteIndex] : null;

  return (
    <div className="bg-gradient-to-r from-teal-200 via-pink-200 to-purple-200 rounded-xl p-6 shadow-lg">
      <h3 className="font-semibold text-xl mb-4 text-center">
        Inspirational Quote ✨
      </h3>
      <blockquote className="italic text-center text-muted-foreground">
        {currentQuote ? `"${currentQuote.quote}"` : "Loading..."}
        {currentQuote && (
          <cite className="block font-semibold mt-2">
            - {currentQuote.author}
          </cite>
        )}
      </blockquote>
      <div className="text-center mt-4">
        <Button onClick={handleChangeQuote} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" /> New Quote
        </Button>
      </div>
    </div>
  );
}


// Firestore Video Section
function FirestoreVideoSection({ searchTerm, hardcodedVideos }: { searchTerm: string; hardcodedVideos: {id: string, name: string, url: string}[] }) {
    const { data: firestoreVideos, loading } = useFirestoreCollection('videos');

    const allVideos = useMemo(() => {
        // Combine hardcoded and firestore videos
        const combined = [...hardcodedVideos.map(v => ({...v, title: v.name}))];
        
        const firestoreFormatted = (firestoreVideos || []).map((v: any) => ({
            id: v.id,
            title: v.name,
            url: v.url,
            visible: v.visible,
        }));

        firestoreFormatted.forEach(dbVideo => {
            if (dbVideo.visible !== false && !combined.some(hVideo => hVideo.url === dbVideo.url)) {
                combined.push(dbVideo);
            }
        });
        
        return combined;

    }, [hardcodedVideos, firestoreVideos]);

    const filteredVideos = useMemo(() => {
        if (!searchTerm) return allVideos;
        
        return allVideos.filter(video => 
            video.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allVideos, searchTerm]);

    return (
        <Card className="bg-card/70 rounded-2xl shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-headline text-primary">All Videos</CardTitle>
                <CardDescription>A comprehensive library of all videos. You can add more in the admin dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                     <div className="flex items-center justify-center py-10 text-muted-foreground gap-2"><Loader2 className="animate-spin h-5 w-5"/>Loading videos...</div>
                ) : filteredVideos && filteredVideos.length > 0 ? (
                     <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVideos.map((video) => (
                            <VideoCard key={video.id} title={video.title} url={video.url} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground font-semibold">
                            {searchTerm ? `No videos found for "${searchTerm}"` : "No videos have been added yet."}
                        </p>
                        <p className="text-muted-foreground text-sm">
                            {searchTerm ? "Try a different search term or clear the search." : "Add videos via the admin dashboard to see them here."}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function YouTubeSearchSection({ searchTerm }: { searchTerm: string }) {
    const [searchResults, setSearchResults] = useState<YoutubeSearchOutput | null>(null);
    const [isSearching, startSearchTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        if (debouncedSearchTerm) {
            startSearchTransition(async () => {
                setError(null);
                try {
                    const results = await searchYoutubeVideos({ query: debouncedSearchTerm });
                    setSearchResults(results);
                } catch (e: any) {
                    console.error("YouTube search error:", e);
                    setError(e.message || "Failed to search YouTube. Check API key and permissions.");
                }
            });
        } else {
            setSearchResults(null);
            setError(null);
        }
    }, [debouncedSearchTerm]);


    return (
        <Card className="bg-card/70 rounded-2xl shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-headline text-primary">Search YouTube</CardTitle>
                <CardDescription>Find mental wellness videos from across YouTube.</CardDescription>
            </CardHeader>
            <CardContent>
                {isSearching && (
                    <div className="flex items-center justify-center py-10 text-muted-foreground gap-2"><Loader2 className="animate-spin h-5 w-5"/>Searching YouTube...</div>
                )}

                {!isSearching && error && (
                     <div className="text-center py-16 text-destructive">
                        <p className="font-semibold">
                           {error.includes("API key") ? "API Key Error" : "Search Failed"}
                        </p>
                        <p className="text-sm mt-2">
                           {error.includes("API key") 
                           ? "Please ensure a valid YouTube API key is in your .env file."
                           : "Could not retrieve video results. Please try again later."
                           }
                        </p>
                    </div>
                )}

                {!isSearching && !error && searchResults && searchResults.videos.length > 0 && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {searchResults.videos.map((video) => (
                           <VideoCard key={video.id} title={video.title} videoId={video.id} />
                        ))}
                    </div>
                )}

                {!isSearching && !error && debouncedSearchTerm && searchResults && searchResults.videos.length === 0 && (
                     <div className="text-center py-16">
                        <p className="text-muted-foreground font-semibold">
                           No YouTube videos found for "{debouncedSearchTerm}".
                        </p>
                    </div>
                )}
                 {!isSearching && !debouncedSearchTerm && (
                     <div className="text-center py-16">
                        <p className="text-muted-foreground font-semibold">
                           Enter a term in the search bar above to search YouTube.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}


// 🌟 Page
export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all-videos");

  const hardcodedVideos = useMemo(() => {
    const videos: { id: string, name: string, url: string }[] = [];
    const seenUrls = new Set<string>();

    Object.values(categoriesData).forEach(category => {
        if (category.videos) {
            category.videos.forEach(video => {
                if (!seenUrls.has(video.url)) {
                    videos.push({ ...video, name: video.title });
                    seenUrls.add(video.url);
                }
            });
        }
    });
    return videos;
  }, []);

  const filteredData = useMemo(() => {
    if (activeTab === 'all-videos' || activeTab === 'youtube-search') return null;

    const categoryData =
      categoriesData[activeTab as keyof typeof categoriesData];
    if (!searchTerm) return categoryData;

    const lower = searchTerm.toLowerCase();
    const filterItems = (items: { title: string, url: string }[] | undefined) =>
      items?.filter((item) =>
        item.title.toLowerCase().includes(lower)
      ) ?? [];

    return {
      ...categoryData,
      videos: filterItems(categoryData.videos),
      audios: filterItems(categoryData.audios),
      articles: filterItems(categoryData.articles),
    };
  }, [searchTerm, activeTab]);

  return (
    <FadeIn>
      <div className="relative overflow-hidden">
        {/* Floating colorful background */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-300 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-purple-300 rounded-full opacity-30 animate-bounce"></div>

        <div className="container mx-auto py-12 px-4 md:px-6 relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold tracking-tight font-headline text-primary">
              Resource Library 🌸
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              A colorful, curated collection of videos, music, and articles to
              brighten your journey toward mental well-being.
            </p>
          </div>

          {/* Search */}
          <div className="w-full max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              e.g., "meditation", "sleep", "stress"
            </p>
          </div>


          {/* Tabs */}
          <Tabs
            defaultValue="all-videos"
            className="w-full"
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              // Do not reset search term to allow searching across tabs
            }}
          >
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2 bg-gradient-to-r from-teal-200 via-purple-200 to-pink-200 rounded-xl p-2">
               <TabsTrigger key="all-videos" value="all-videos">
                  <Video className="mr-2 h-4 w-4"/> All Videos
               </TabsTrigger>
               <TabsTrigger key="youtube-search" value="youtube-search">
                  <Youtube className="mr-2 h-4 w-4"/> YouTube
               </TabsTrigger>
              {Object.entries(categoriesData).map(([key, category]) => (
                <TabsTrigger key={key} value={key}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent key="all-videos" value="all-videos" className="mt-10">
                <FirestoreVideoSection searchTerm={searchTerm} hardcodedVideos={hardcodedVideos} />
            </TabsContent>

            <TabsContent key="youtube-search" value="youtube-search" className="mt-10">
                <YouTubeSearchSection searchTerm={searchTerm} />
            </TabsContent>

            {Object.entries(categoriesData).map(([key]) => (
              filteredData && activeTab === key && (
                <TabsContent key={key} value={key} className="mt-10">
                <Card className="bg-card/70 rounded-2xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl font-headline text-primary">
                      {filteredData.name}
                    </CardTitle>
                    <CardDescription>
                      {filteredData.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-10">
                    {/* Videos */}
                    {(filteredData.videos?.length ?? 0) > 0 && (
                      <div>
                        <h3 className="font-semibold text-xl mb-6 flex items-center gap-2">
                          <Youtube className="text-primary" /> Videos
                        </h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredData.videos?.map((video) => (
                            <VideoCard key={video.id} title={video.title} url={video.url} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Audios */}
                    {(filteredData.audios?.length ?? 0) > 0 && (
                      <div>
                        <h3 className="font-semibold text-xl mb-6 flex items-center gap-2">
                          <Music className="text-primary" /> Audio & Music
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-6">
                          {filteredData.audios?.map((audio) => (
                             <VideoCard key={audio.id} title={audio.title} url={audio.url} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Articles */}
                    {(filteredData.articles?.length ?? 0) > 0 && (
                      <div>
                        <h3 className="font-semibold text-xl mb-6 flex items-center gap-2">
                          <FileText className="text-primary" /> Articles
                        </h3>
                        <p className="text-muted-foreground">
                          (Coming soon...)
                        </p>
                      </div>
                    )}

                    {/* No Results */}
                    {(filteredData.videos?.length ?? 0) === 0 &&
                      (filteredData.audios?.length ?? 0) === 0 &&
                      (filteredData.articles?.length ?? 0) === 0 && (
                        <div className="text-center py-16">
                          <p className="text-muted-foreground font-semibold">
                            No resources found for "{searchTerm}".
                          </p>
                          <p className="text-muted-foreground text-sm">
                            Try a different search term or check other
                            categories.
                          </p>
                        </div>
                      )}

                    {/* Quote */}
                    <QuoteDisplay />
                  </CardContent>
                </Card>
              </TabsContent>
              )
            ))}
          </Tabs>
        </div>
      </div>
    </FadeIn>
  );
}
