
"use client";

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartHandshake, Lightbulb, Target, Mail } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';


const teamMembers = [
  { name: 'Aryan', role: 'Founder & Leader', avatar: 'https://placehold.co/200x200/f9a84a/1a6e4a?text=A', dataAiHint: 'anime man', bio: 'A young and passionate student who wants to learn more about development (including web and AI development).', email: 'watervolt69@gmail.com' },
  { name: 'Gaurav', role: 'Resources Provider', avatar: 'https://placehold.co/200x200/53c599/1a6e4a?text=G', dataAiHint: 'person face', bio: '(bio)', email: 'gauravxns001@gmail.com' },
  { name: 'Kartik', role: 'Tester', avatar: 'https://placehold.co/200x200/f9a84a/1a6e4a?text=K', dataAiHint: 'person face', bio: '(bio)', email: 'kartiksharmaa2066@gmail.com' },
  { name: 'Anubhav', role: 'Tester', avatar: 'https://placehold.co/200x200/53c599/1a6e4a?text=A', dataAiHint: 'person face', bio: '(bio)', email: 'anubhavahluwalia02@gmail.com' },
  { name: 'Dharvi', role: 'Presentation Designer', avatar: 'https://placehold.co/200x200/f9a84a/1a6e4a?text=D', dataAiHint: 'person face', bio: '(bio)', email: 'garvitwadhawansxs000@gmail.com' },
  { name: 'Garvit', role: 'Resources Provider', avatar: 'https://placehold.co/200x200/53c599/1a6e4a?text=G', dataAiHint: 'person face', bio: '(bio)', email: 'garvitwadhawansxs000@gmail.com' },
];

const values = [
    { icon: <HeartHandshake className="h-8 w-8 text-primary"/>, title: "Accessibility", description: "We believe everyone deserves access to quality mental health support, regardless of their circumstances." },
    { icon: <Target className="h-8 w-8 text-primary"/>, title: "Empathy", description: "Our approach is rooted in compassion and understanding for each individual's unique journey." },
    { icon: <Lightbulb className="h-8 w-8 text-primary"/>, title: "Integrity", description: "We are committed to providing evidence-based, responsible, and ethical tools and resources." },
];


const TeamMemberCard = ({ member }: { member: typeof teamMembers[0] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isMobile = useIsMobile();
    let hoverTimeout: NodeJS.Timeout;

    const handleMouseEnter = () => {
        if (!isMobile) {
            hoverTimeout = setTimeout(() => {
                setIsOpen(true);
            }, 300); // 300ms delay to prevent accidental popups
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            clearTimeout(hoverTimeout);
        }
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Card 
                    className="overflow-hidden text-center hover:shadow-lg transition-shadow cursor-pointer"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={isMobile ? () => setIsOpen(true) : undefined}
                >
                    <CardContent className="p-6 flex flex-col items-center">
                        <Avatar className="w-32 h-32 mb-4 border-4 border-primary/20">
                            <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.dataAiHint} />
                            <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-xl">{member.name}</CardTitle>
                        <CardDescription>{member.role}</CardDescription>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" onMouseLeave={!isMobile ? () => setIsOpen(false) : undefined}>
                <DialogHeader className="items-center text-center">
                     <Avatar className="w-24 h-24 mb-4 border-4 border-primary/20">
                        <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.dataAiHint} />
                        <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <DialogTitle className="text-2xl">{member.name}</DialogTitle>
                    <DialogDescription>{member.role}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <p className="text-muted-foreground text-center">{member.bio}</p>
                    <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-primary"/>
                        <a href={`mailto:${member.email}`} className="text-sm hover:underline">{member.email}</a>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}


export default function AboutPage() {
    return (
        <FadeIn>
            <div className="container mx-auto py-12 px-4 md:px-6">
                {/* Mission Section */}
                <section className="text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight font-headline">Our Mission</h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                        To empower students in higher education with accessible, compassionate, and stigma-free tools to navigate their mental health journey.
                    </p>
                </section>

                {/* Values Section */}
                <section className="mb-24">
                    <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:gap-12 lg:grid-cols-3">
                        {values.map((value) => (
                            <div key={value.title} className="text-center flex flex-col items-center">
                                {value.icon}
                                <h3 className="text-xl font-bold mt-4">{value.title}</h3>
                                <p className="text-muted-foreground mt-2">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Team Section */}
                <section>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight font-headline">Meet Our Team</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                            We are a diverse group of students, technologists, and creatives dedicated to your well-being.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {teamMembers.map((member) => (
                           <TeamMemberCard key={member.name} member={member} />
                        ))}
                    </div>
                </section>
            </div>
        </FadeIn>
    );
}

    