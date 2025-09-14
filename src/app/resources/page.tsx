"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
        setVideos(data.items || []);
      } catch (err) {
        console.error("Error fetching YouTube data:", err);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-100 to-purple-200 p-6">
      <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
        🌈 Helpful YouTube Resources
      </h1>
      <form
        onSubmit={handleSearch}
        className="max-w-xl mx-auto mb-8 flex gap-2"
      >
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for topics like 'anxiety', 'meditation'..."
          className="bg-white/80"
        />
        <Button type="submit">
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </form>

      {loading ? (
        <div className="flex justify-center items-center h-64 text-lg font-semibold">
          Loading YouTube Videos...
        </div>
      ) : videos.length === 0 ? (
        <p className="text-center text-gray-600">
          No videos found for "{searchTerm}". Try another search.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id.videoId || video.id.channelId}
              className="rounded-2xl shadow-lg bg-white overflow-hidden hover:scale-105 transition-transform duration-300"
            >
              <iframe
                className="w-full h-60"
                src={`https://www.youtube.com/embed/${video.id.videoId}`}
                title={video.snippet.title}
                allowFullScreen
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-1">
                  {video.snippet.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {video.snippet.channelTitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
