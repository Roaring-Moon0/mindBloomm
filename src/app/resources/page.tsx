
"use client";

import { useState, useMemo, useEffect } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FadeIn } from "@/components/ui/fade-in";

// 🌟 Categories
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
  animated: {
    name: "Animated Therapy 🌈",
    description: "Fun, colorful animated videos that bring light to your day.",
    videos: [
      {
        id: 'Y9A5wuTtblw',
        title: "Animated Guide to Beating Depression",
        url: "https://www.youtube.com/embed/Y9A5wuTtblw",
      },
      {
        id: 'fD7xJp8tp2U',
        title: "Fun Stress Relief Animation",
        url: "https://www.youtube.com/embed/fD7xJp8tp2U",
      },
    ],
    audios: [],
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
function VideoCard({ title, url }: { title: string; url: string }) {
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

// 🌟 Page
export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("anxiety");

  const filteredData = useMemo(() => {
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
                placeholder="Search resources in this category..."
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
            defaultValue="anxiety"
            className="w-full"
            onValueChange={(value) => {
              setActiveTab(value);
              setSearchTerm("");
            }}
          >
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 bg-gradient-to-r from-teal-200 via-purple-200 to-pink-200 rounded-xl p-2">
              {Object.entries(categoriesData).map(([key, category]) => (
                <TabsTrigger key={key} value={key}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(categoriesData).map(([key]) => (
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
                            <VideoCard key={video.url} {...video} />
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
                            <VideoCard key={audio.url} {...audio} />
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
            ))}
          </Tabs>
        </div>
      </div>
    </FadeIn>
  );
}
