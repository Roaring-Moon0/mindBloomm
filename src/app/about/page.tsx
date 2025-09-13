
"use client";

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartHandshake, Lightbulb, Target, Mail, Linkedin } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import Link from 'next/link';

interface TeamMember {
    name: string;
    role: string;
    avatar: string;
    dataAiHint: string;
    bio: string;
    email: string;
    linkedin?: string;
}

const teamMembers: TeamMember[] = [
  { name: 'Aryan', role: 'Founder & Leader', avatar: '/assets/aryan.png', dataAiHint: 'anime man', bio: 'As the team leader and a B.Tech student in AI/ML, I guide our project\'s vision. My goal is to merge technology with empathy to create genuinely helpful mental wellness solutions.', email: 'watervolt69@gmail.com', linkedin: 'https://www.linkedin.com/in/aryan-4500a7380' },
  { name: 'Gaurav', role: 'Resources Provider', avatar: '/assets/gaurav.png', dataAiHint: 'person face', bio: 'As a B.Tech CSE student, I focus on gathering and curating the articles, videos, and music for our resource library, ensuring our content is both helpful and supportive.', email: 'gauravxns001@gmail.com', linkedin: 'https://www.linkedin.com/in/gaurav-sharma-a44435378' },
  { name: 'Kartik', role: 'Tester', avatar: '/assets/kartik.png', dataAiHint: 'person face', bio: 'As a B.Tech student in Robotics and AI, I contribute as a tester to ensure the website is reliable, user-friendly, and impactful for everyone who uses it.', email: 'kartiksharmaa2066@gmail.com', linkedin: 'https://www.linkedin.com/in/kartik-sharma-41b552336' },
  { name: 'Anubhav', role: 'Tester', avatar: '/assets/anubhav.png', dataAiHint: 'person face', bio: 'I help ensure the app is working smoothly by testing new features and identifying any issues, contributing to a seamless user experience.', email: 'anubhavahluwalia02@gmail.com', linkedin: 'https://www.linkedin.com/in/anubhav-ahluwalia-55a459384' },
  { name: 'Dharvi', role: 'Presentation Designer & Co-developer', avatar: '/assets/Dharvi.png', dataAiHint: 'person face', bio: "As the team's Presentation Designer, I craft the visuals that tell our story with clarity and impact. I also contribute as a Co-Developer, helping to blend creative design with functional technology to build a user-friendly and effective experience.", email: 'shivimehta2008@gmail.com', linkedin: 'https://www.linkedin.com/in/dharvi-mehta-b44952239' },
  { name: 'Ruhi', role: 'Resources Provider', avatar: '/assets/ruhi.png', dataAiHint: 'person face', bio: 'I assist in finding and organizing high-quality resources for our library, helping to provide users with valuable and effective mental wellness content.', email: 'ruhikumari2672@gmail.com', linkedin: 'https://www.linkedin.com/in/ruhi-kumari-774a95378' },
];

const values = [
    { icon: <HeartHandshake className="h-8 w-8 text-primary"/>, title: "Accessibility", description: "We believe everyone deserves access to quality mental health support, regardless of their circumstances." },
    { icon: <Target className="h-8 w-8 text-primary"/>, title: "Empathy", description: "Our approach is rooted in compassion and understanding for each individual's unique journey." },
    { icon: <Lightbulb className="h-8 w-8 text-primary"/>, title: "Integrity", description: "We are committed to providing evidence-based, responsible, and ethical tools and resources." },
];


const TeamMemberCard = ({ member }: { member: TeamMember }) => {
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

    const avatarSrc = member.avatar;
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Card 
                    className="overflow-hidden text-center hover:shadow-lg transition-shadow cursor-pointer hover:bg-secondary hover:border-primary/50"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={isMobile ? () => setIsOpen(true) : undefined}
                >
                    <CardContent className="p-6 flex flex-col items-center">
                        <Avatar className="w-32 h-32 mb-4 border-4 border-primary/20">
                            <AvatarImage src={avatarSrc} alt={member.name} data-ai-hint={member.dataAiHint} />
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
                        <AvatarImage src={avatarSrc} alt={member.name} data-ai-hint={member.dataAiHint} />
                        <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <DialogTitle className="text-2xl">{member.name}</DialogTitle>
                    <DialogDescription>{member.role}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <p className="text-muted-foreground text-center whitespace-pre-line">{member.bio}</p>
                    <div className="flex items-center justify-center gap-6">
                        <Link href={`mailto:${member.email}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:underline text-muted-foreground hover:text-primary">
                            <Mail className="w-5 h-5"/>
                            <span>Email</span>
                        </Link>
                         {member.linkedin && (
                            <Link href={member.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:underline text-muted-foreground hover:text-primary">
                                <Linkedin className="w-5 h-5" />
                                <span>LinkedIn</span>
                            </Link>
                        )}
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

    