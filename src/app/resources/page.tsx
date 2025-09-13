"use client";

import { useState } from "react";
import { Youtube, Music, FileText, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FadeIn } from "@/components/ui/fade-in";
import QuoteDisplay from "@/components/quote-display";

const categoriesData: Record<
  string,
  {
    name: string;
    description: string;
    videos?: { id: string; title: string; url: string }[];
    audios?: { id: string; title: string; url: string }[];
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
      { id: "1h484i3CE18", title: "Solfeggio Frequency for Anxiety", url: "https://www.youtube.com/embed/1h484i3CE18" },
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
        { id: "_2_gP4LMW2s", title: "Sleep Hypnosis for a Deep Sleep", url: "https://www.youtube.com/embed/_2_gP4LMW2s" },
        { id: "BiG4Q2-r5Co", title: "Bedtime Yoga", url: "https://www.youtube.com/embed/BiG4Q2-r5Co" },
        { id: "Zq2j3gIuD3Q", title: "The Perfect Sleep Routine", url: "https://www.youtube.com/embed/Zq2j3gIuD3Q" },
    ],
    audios: [
      { id: "aIq_HqVSlqA", title: "Deep Sleep Music, Insomnia, Relaxing Music", url: "https://www.youtube.com/embed/aIq_HqVSlqA" },
      { id: "j4dwyAPg8eA", title: "Rain Sounds for Sleeping", url: "https://www.youtube.com/embed/j4dwyAPg8eA" },
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
      { id: "calI9aV_eWc", title: "3 Hours of Relaxing Music for Stress Relief", url: "https://www.youtube.com/embed/calI9aV_eWc" },
    ],
    articles: [],
  },
  motivational: {
    name: "Motivational",
    description: "Inspiring talks and content to lift your spirits.",
    videos: [
      { id: "Lp7-V89R2sM", title: "The Psychology of a Winner - Motivational Speech", url: "https://www.youtube.com/embed/Lp7-V89R2sM" },
      { id: "Qcxj1RM6-u0", title: "How to Stop Procrastinating", url: "https://www.youtube.com/embed/Qcxj1RM6-u0" },
    ],
    audios: [
      { id: "3sK3wJAxGfs", title: "Inspirational Talk on Resilience", url: "https://www.youtube.com/embed/3sK3wJAxGfs" },
    ],
    articles: [],
  }
};


// ---------------- VideoCard Component ----------------
function VideoCard({ title, url }: { title: string; url: string }) {
  return (
    <Card className="bg-card/80 rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-transform">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video rounded-lg overflow-hidden">
          <iframe
            src={url}
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

// ---------------- Page ----------------
export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("anxiety");

  return (
    <FadeIn>
      <div className="container mx-auto py-12 px-4 md:px-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Resource Library
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A curated collection of videos, music, and wisdom to help you find
            calm, clarity, and balance.
          </p>
        </div>

        {/* Search */}
        <div className="w-full max-w-lg mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              className="pl-10 rounded-full shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="anxiety"
          className="w-full"
          onValueChange={(value) => {
            setActiveTab(value);
            setSearchTerm("");
          }}
        >
          {/* Tab List */}
          <TabsList className="flex flex-wrap justify-center gap-2 p-2 rounded-lg bg-muted/40">
            {Object.entries(categoriesData).map(([key, category]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="px-4 py-2 rounded-full font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content */}
          {Object.entries(categoriesData).map(([key, category]) => {
            const filteredVideos = category.videos?.filter((v) =>
              v.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            const filteredAudios = category.audios?.filter((a) =>
              a.title.toLowerCase().includes(searchTerm.toLowerCase())
            );

            return (
              <TabsContent key={key} value={key} className="mt-10">
                <Card className="bg-card/80 shadow-lg rounded-2xl p-6">
                  <CardHeader>
                    <CardTitle className="text-2xl">{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-12">
                    {/* Videos */}
                    {filteredVideos && filteredVideos.length > 0 && (
                      <section>
                        <h3 className="font-semibold text-xl mb-6 flex items-center gap-2">
                          <Youtube className="text-primary" /> Videos
                        </h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredVideos.map((video) => (
                            <VideoCard key={video.id} {...video} />
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Audios */}
                    {filteredAudios && filteredAudios.length > 0 && (
                      <section>
                        <h3 className="font-semibold text-xl mb-6 flex items-center gap-2">
                          <Music className="text-primary" /> Audio & Music
                        </h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredAudios.map((audio) => (
                            <VideoCard key={audio.id} {...audio} />
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Empty state */}
                    {!filteredVideos?.length && !filteredAudios?.length && (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground font-semibold">
                          No resources found for "{searchTerm}".
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Try a different search term or explore other
                          categories.
                        </p>
                      </div>
                    )}

                    {/* Quote Section */}
                    <div className="bg-muted/40 rounded-xl p-6 shadow-inner mt-12">
                      <QuoteDisplay />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </FadeIn>
  );
}