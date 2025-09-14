"use client";
import { useEffect, useState } from "react";

export default function ResourcesPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=mental+health&type=video&maxResults=6&key=${process.env.NEXT_PUBLIC_YT_API_KEY}`
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
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading YouTube Videos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-100 to-purple-200 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        🌈 Helpful YouTube Resources
      </h1>
      {videos.length === 0 ? (
        <p className="text-center text-gray-600">
          No videos found. Try again later.
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
