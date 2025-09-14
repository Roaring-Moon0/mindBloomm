
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Youtube } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResourcesPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("mental health");
  const [searchTerm, setSearchTerm] = useState("mental health");

  useEffect(() => {
    async function fetchVideos() {
      if (!searchTerm) {
        setVideos([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            searchTerm
          )}&type=video&maxResults=9&key=${
            process.env.NEXT_PUBLIC_YT_API_KEY
          }`
        );
        const data = await res.json();
        if (data.items) {
          setVideos(data.items);
        } else {
            setVideos([]);
        }
      } catch (err) {
        console.error("Error fetching YouTube data:", err);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(query);
  };

  const VideoSkeleton = () => (
    <Card className="overflow-hidden">
        <Skeleton className="w-full h-48" />
        <CardContent className="p-4">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
        </CardContent>
    </Card>
  )

  return (
    <FadeIn>
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold tracking-tight font-headline">Resource Library</h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    Search YouTube for videos on topics like 'anxiety', 'meditation', or 'mindfulness'.
                </p>
            </div>

            <form
                onSubmit={handleSearch}
                className="max-w-xl mx-auto mb-12 flex gap-2"
            >
                <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for topics..."
                className="bg-background"
                />
                <Button type="submit" disabled={loading}>
                    <Search className="mr-2 h-4 w-4" /> Search
                </Button>
            </form>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({length: 6}).map((_, i) => <VideoSkeleton key={i}/>)}
                </div>
            ) : videos.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <Youtube className="mx-auto h-16 w-16 mb-4"/>
                    <p className="font-semibold">No videos found for "{searchTerm}".</p>
                    <p className="text-sm">Please try a different search term.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.map((video) => (
                    <Card
                        key={video.id.videoId}
                        className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
                    >
                        <div className="aspect-video">
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${video.id.videoId}`}
                                title={video.snippet.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-lg leading-snug">
                                {video.snippet.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow flex items-end">
                             <p className="text-sm text-muted-foreground">
                                By {video.snippet.channelTitle}
                            </p>
                        </CardContent>
                    </Card>
                ))}
                </div>
            )}
        </div>
    </FadeIn>
  );
}
