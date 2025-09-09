
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Youtube, FileText, RefreshCw, Search, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const categoriesData = {
  anxiety: {
    name: "Anxiety Relief",
    description: "Techniques and resources to calm your mind and manage anxiety.",
    videos: [
      { title: "5-Minute Meditation for Anxiety (English)", id: "O-6f5wQXSu8" },
      { title: "Release Anxiety, Stress & Overthinking (Hindi)", id: "wf4dJ6E-45g" },
      { title: "Guided Meditation for Anxiety & Stress (English)", id: "4pLUleLdwY4" },
      { title: "Quick Anxiety Relief in 5 Minutes (Hindi)", id: "rCzpe7jA4iA" },
    ],
    audios: [
      { title: "Calming Music for Anxiety & Stress", id: "WUXEE22Y-h4" },
      { title: "ASMR for Anxiety Relief", id: "LUdGcmj2D-s" },
    ],
    pdfs: [
      { title: "Understanding Your Anxiety Workbook", source: "#" },
      { title: "Cognitive Behavioral Therapy Techniques", source: "#" },
    ],
  },
  depression: {
    name: "Overcoming Depression",
    description: "A gentle guide to understanding and coping with depression.",
    videos: [
        { title: "What is depression? (English)", id: "z-IR48A_O_c" },
        { title: "अवसाद या डिप्रेशन क्या है? (Hindi)", id: "fWpOD5OisC0" },
        { title: "How to get stuff done when you are depressed (English)", id: "fM1V1l2uC3A" },
        { title: "How To Fight Depression? (Hindi)", id: "gQ4Y18yA-p8" },
    ],
    audios: [
      { title: "Uplifting Music to Boost Your Mood", id: "W8rJU4b_o_I" },
      { title: "Gentle ASMR for Positive Energy", id: "5o2a6k-DKLw" },
    ],
    pdfs: [
      { title: "A Guide to Self-Compassion", source: "#" },
      { title: "Building a Routine When Depressed", source: "#" },
    ],
  },
  sleep: {
    name: "Better Sleep",
    description: "Improve your sleep hygiene and get the rest you deserve.",
    videos: [
        { title: "Sleep Hypnosis for a Deep Sleep (English)", id: "_2_gP4LMW2s" },
        { title: "5 मिनट में गहरी नींद के लिए हिप्नोटिक कहानी (Hindi)", id: "a4sB0QzCgA8" },
        { title: "Bedtime Yoga (English)", id: "BiG4Q2-r5Co" },
        { title: "Yoga For Deep Sleep (Hindi)", id: "xePaJpEdn2s" },
    ],
    audios: [
      { title: "Deep Sleep Music, Insomnia, Relaxing Music", id: "aIq_HqVSlqA" },
      { title: "Rain Sounds for Sleeping", id: "j4dwyAPg8eA" },
    ],
    pdfs: [
      { title: "The Ultimate Guide to a Better Sleep Routine", source: "#" },
      { title: "Journal Prompts for Bedtime", source: "#" },
    ],
  },
  stress: {
    name: "Understanding Stress",
    description: "Learn about the causes of stress and effective solutions.",
    videos: [
        { title: "How stress affects your body (English)", id: "v-t1Z5-oPtU" },
        { title: "तनाव को कैसे खत्म करें? (Hindi)", id: "pS31_O2_sAE" },
        { title: "How to make stress your friend (English)", id: "RcGyVTAoXEU" },
        { title: "What is Stress? (Hindi)", id: "7p4kY_O3yYw" },
    ],
    audios: [
      { title: "3 Hours of Relaxing Music for Stress Relief", id: "calI9aV_eWc" },
      { title: "Gentle ASMR to Melt Your Stress Away", id: "Y_t-bWpG4jA" },
    ],
    pdfs: [
      { title: "The Stress Management Handbook", source: "#" },
      { title: "Identifying Your Stress Triggers", source: "#" },
    ],
  },
};

const allQuotes = [
    { quote: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { quote: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
    { quote: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
    { quote: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
    { quote: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
    { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { quote: "Your limitation—it's only your imagination.", author: "Unknown" },
    { quote: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { quote: "Sometimes later becomes never. Do it now.", author: "Unknown" },
    { quote: "Great things never come from comfort zones.", author: "Unknown" },
    { quote: "Dream it. Wish it. Do it.", author: "Unknown" },
    { quote: "Success doesn’t just find you. You have to go out and get it.", author: "Unknown" },
    { quote: "The harder you work for something, the greater you’ll feel when you achieve it.", author: "Unknown" }
];


const ResourceCard = ({ icon, title, type }: { icon: React.ReactNode, title: string, type: string }) => (
    <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 flex items-center gap-4">
            {icon}
            <div className="flex-1">
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{type}</p>
            </div>
        </CardContent>
    </Card>
);

const VideoCard = ({ id, title }: { id: string, title: string }) => (
    <div className="flex flex-col gap-2">
        <div className="aspect-video">
            <iframe
                className="w-full h-full rounded-lg"
                src={`https://www.youtube.com/embed/${id}`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
        <p className="text-sm font-medium text-center">{title}</p>
    </div>
);


const QuoteDisplay = () => {
    const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * allQuotes.length));

    const handleChangeQuote = () => {
        setQuoteIndex(prev => (prev + 1) % allQuotes.length);
    };
    
    const currentQuote = allQuotes[quoteIndex];

    return (
         <div>
            <h3 className="font-semibold text-xl mb-4">Inspirational Quote</h3>
            <div className="space-y-4">
                <blockquote className="border-l-4 border-accent pl-4 italic text-muted-foreground min-h-[60px]">
                   "{currentQuote.quote}" - <cite className="font-semibold not-italic">{currentQuote.author}</cite>
                </blockquote>
                <Button onClick={handleChangeQuote} variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    New Quote
                </Button>
            </div>
        </div>
    )
}

export default function ResourcesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('anxiety');

    const filteredData = useMemo(() => {
        const categoryData = categoriesData[activeTab as keyof typeof categoriesData];
        if (!searchTerm) {
            return categoryData;
        }

        const lowercasedFilter = searchTerm.toLowerCase();

        const filterItems = (items: { title: string }[]) => 
            items.filter(item => item.title.toLowerCase().includes(lowercasedFilter));

        return {
            ...categoryData,
            videos: filterItems(categoryData.videos),
            audios: filterItems(categoryData.audios),
            pdfs: filterItems(categoryData.pdfs),
        };
    }, [searchTerm, activeTab]);

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold tracking-tight font-headline">Resource Library</h1>
                <p className="mt-4 text-lg text-muted-foreground">A curated collection of tools and knowledge for your mental well-being.</p>
            </div>

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
                <p className="text-xs text-center text-muted-foreground mt-2">e.g., "meditation", "sleep", "stress"</p>
            </div>

            <Tabs defaultValue="anxiety" className="w-full" onValueChange={(value) => setActiveTab(value)}>
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
                    {Object.entries(categoriesData).map(([key, category]) => (
                        <TabsTrigger key={key} value={key} className="py-2">{category.name}</TabsTrigger>
                    ))}
                </TabsList>

                {Object.entries(categoriesData).map(([key]) => (
                    <TabsContent key={key} value={key} className="mt-8">
                        <Card className="bg-secondary/30">
                             <CardHeader>
                                <CardTitle className="text-2xl font-headline">{filteredData.name}</CardTitle>
                                <CardDescription>{filteredData.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                {filteredData.videos.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-xl mb-4 flex items-center gap-2"><Youtube className="text-primary"/> Videos</h3>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {filteredData.videos.map(video => (
                                                <VideoCard key={video.id} {...video} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {filteredData.audios.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-xl mb-4 flex items-center gap-2"><Music className="text-primary"/> Audio & Music</h3>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {filteredData.audios.map(audio => (
                                                 <VideoCard key={audio.id} {...audio} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {filteredData.pdfs.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-xl mb-4 flex items-center gap-2"><FileText className="text-primary"/> Articles & PDFs</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {filteredData.pdfs.map(pdf => (
                                                <a href={pdf.source} key={pdf.title} target="_blank" rel="noopener noreferrer">
                                                    <ResourceCard icon={<FileText/>} title={pdf.title} type="PDF Document"/>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {filteredData.videos.length === 0 && filteredData.audios.length === 0 && filteredData.pdfs.length === 0 && (
                                     <div className="text-center py-12">
                                        <p className="text-muted-foreground font-semibold">No resources found for "{searchTerm}".</p>
                                        <p className="text-muted-foreground text-sm">Try a different search term or check other categories.</p>
                                     </div>
                                )}

                                <QuoteDisplay />
                                
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}

    