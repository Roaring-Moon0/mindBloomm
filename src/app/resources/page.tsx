
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Youtube, FileAudio, FileText, RefreshCw, Search } from 'lucide-react';
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
      { title: "Calming Music for Anxiety", source: "#" },
      { title: "Deep Breathing Exercise Audio", source: "#" },
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
      { title: "Uplifting Podcast for a Better Mood", source: "#" },
      { title: "Affirmations for Self-Love", source: "#" },
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
      { title: "Guided Sleep Meditation", source: "#" },
      { title: "Calming Nature Sounds for Sleep", source: "#" },
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
      { title: "Mindfulness for Stress Reduction", source: "#" },
      { title: "Ambient sounds for focus and relaxation", source: "#" },
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
        if (!searchTerm) {
            return categoriesData[activeTab as keyof typeof categoriesData];
        }

        const lowercasedFilter = searchTerm.toLowerCase();
        const categoryData = categoriesData[activeTab as keyof typeof categoriesData];

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
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {filteredData.videos.map(video => (
                                                 <div key={video.id} className="flex flex-col gap-2">
                                                    <div className="aspect-video">
                                                        <iframe
                                                            className="w-full h-full rounded-lg"
                                                            src={`https://www.youtube.com/embed/${video.id}`}
                                                            title={video.title}
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        ></iframe>
                                                    </div>
                                                    <p className="text-sm font-medium text-center">{video.title}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                <div className="grid md:grid-cols-2 gap-8">
                                    {filteredData.audios.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold text-xl mb-4 flex items-center gap-2"><FileAudio className="text-primary"/> Audio Resources</h3>
                                            <div className="space-y-4">
                                                {filteredData.audios.map(audio => (
                                                    <a href={audio.source} key={audio.title} target="_blank" rel="noopener noreferrer">
                                                        <ResourceCard icon={<FileAudio/>} title={audio.title} type="Audio"/>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {filteredData.pdfs.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold text-xl mb-4 flex items-center gap-2"><FileText className="text-primary"/> Articles & PDFs</h3>
                                            <div className="space-y-4">
                                                {filteredData.pdfs.map(pdf => (
                                                    <a href={pdf.source} key={pdf.title} target="_blank" rel="noopener noreferrer">
                                                        <ResourceCard icon={<FileText/>} title={pdf.title} type="PDF Document"/>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
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
