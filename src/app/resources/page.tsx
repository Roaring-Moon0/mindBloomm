import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Youtube, FileAudio, FileText } from 'lucide-react';

const categories = {
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
    quotes: [
      { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
      { text: "The greatest weapon against stress is our ability to choose one thought over another.", author: "William James" },
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
     quotes: [
      { text: "Even the darkest night will end and the sun will rise.", author: "Victor Hugo" },
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
    quotes: [
      { text: "Sleep is the best meditation.", author: "Dalai Lama" },
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
    quotes: [
      { text: "It's not the load that breaks you down, it's the way you carry it.", author: "Lou Holtz" },
    ],
  },
};

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

export default function ResourcesPage() {
    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight font-headline">Resource Library</h1>
                <p className="mt-4 text-lg text-muted-foreground">A curated collection of tools and knowledge for your mental well-being.</p>
            </div>

            <Tabs defaultValue="anxiety" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
                    {Object.entries(categories).map(([key, category]) => (
                        <TabsTrigger key={key} value={key} className="py-2">{category.name}</TabsTrigger>
                    ))}
                </TabsList>

                {Object.entries(categories).map(([key, category]) => (
                    <TabsContent key={key} value={key} className="mt-8">
                        <Card className="bg-secondary/30">
                            <CardHeader>
                                <CardTitle className="text-2xl font-headline">{category.name}</CardTitle>
                                <p className="text-muted-foreground">{category.description}</p>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div>
                                    <h3 className="font-semibold text-xl mb-4 flex items-center gap-2"><Youtube className="text-primary"/> Videos</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {category.videos.map(video => (
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
                                
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="font-semibold text-xl mb-4 flex items-center gap-2"><FileAudio className="text-primary"/> Audio Resources</h3>
                                        <div className="space-y-4">
                                            {category.audios.map(audio => (
                                                <a href={audio.source} key={audio.title} target="_blank" rel="noopener noreferrer">
                                                    <ResourceCard icon={<FileAudio/>} title={audio.title} type="Audio"/>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-xl mb-4 flex items-center gap-2"><FileText className="text-primary"/> Articles & PDFs</h3>
                                        <div className="space-y-4">
                                            {category.pdfs.map(pdf => (
                                                <a href={pdf.source} key={pdf.title} target="_blank" rel="noopener noreferrer">
                                                    <ResourceCard icon={<FileText/>} title={pdf.title} type="PDF Document"/>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-xl mb-4">Inspirational Quotes</h3>
                                    <div className="space-y-4">
                                        {category.quotes.map((quote, index) => (
                                            <blockquote key={index} className="border-l-4 border-accent pl-4 italic text-muted-foreground">
                                                "{quote.text}" - <cite className="font-semibold not-italic">{quote.author}</cite>
                                            </blockquote>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
