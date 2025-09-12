
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Linkedin } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import Link from 'next/link';
import placeholderImages from '@/lib/placeholder-images.json';

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
  { name: 'Aryan', role: 'Founder & Leader', avatar: placeholderImages.aryan.src, dataAiHint: placeholderImages.aryan.hint, bio: 'A young and passionate student who wants to learn more about development (including web and AI development).', email: 'watervolt69@gmail.com', linkedin: 'https://www.linkedin.com/in/aryan-4500a7380' },
  { name: 'Gaurav', role: 'Resources Provider', avatar: placeholderImages.gaurav.src, dataAiHint: placeholderImages.gaurav.hint, bio: 'I’m Gaurav Sharma, currently pursuing B.Tech in Computer Science Engineering and contributing as a resource provider for this group project. Our website offers articles, games, videos, music, and AI-powered tools to help improve mental health in an accessible and engaging way.\n\nI’m passionate about combining technology and care to support mental well-being and provide useful resources for everyone.', email: 'gauravxns001@gmail.com', linkedin: 'https://www.linkedin.com/in/gaurav-sharma-a44435378' },
  { name: 'Kartik', role: 'Tester', avatar: placeholderImages.kartik.src, dataAiHint: placeholderImages.kartik.hint, bio: '(bio)', email: 'kartiksharmaa2066@gmail.com', linkedin: 'https://www.linkedin.com/in/kartik-sharma-41b552336' },
  { name: 'Anubhav', role: 'Tester', avatar: placeholderImages.anubhav.src, dataAiHint: placeholderImages.anubhav.hint, bio: '(bio)', email: 'anubhavahluwalia02@gmail.com', linkedin: 'https://www.linkedin.com/in/anubhav-ahluwalia-55a459384' },
  { name: 'Dharvi', role: 'Presentation Designer & Co-developer', avatar: placeholderImages.dharvi.src, dataAiHint: placeholderImages.dharvi.hint, bio: '(bio)', email: 'shivimehta2008@gmail.com', linkedin: 'https://www.linkedin.com/in/dharvi-mehta-b44952239' },
  { name: 'Ruhi', role: 'Resources Provider', avatar: placeholderImages.ruhi.src, dataAiHint: placeholderImages.ruhi.hint, bio: '(bio)', email: 'ruhikumari2672@gmail.com', linkedin: 'https://www.linkedin.com/in/ruhi-kumari-774a95378' },
];

const values = [
    { title: "Our Mission", description: "To empower students in higher education with accessible, compassionate, and stigma-free tools to navigate their mental health journey." },
    { title: "Our Vision", description: "To create a world where every student feels understood, supported, and equipped to thrive mentally and emotionally." },
];


const TeamMemberCard = ({ member }: { member: TeamMember }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isMobile = useIsMobile();
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div 
                    className="group relative cursor-pointer"
                    onClick={() => setIsOpen(true)}
                >
                    <div className="overflow-hidden rounded-lg">
                        <Image 
                            src={member.avatar} 
                            alt={member.name}
                            data-ai-hint={member.dataAiHint}
                            width={400}
                            height={400}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                     <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4">
                        <h3 className="text-xl font-bold text-white">{member.name}</h3>
                        <p className="text-green-300">{member.role}</p>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-card border-border">
                <DialogHeader className="items-center text-center">
                     <Avatar className="w-24 h-24 mb-4 border-4 border-primary/50">
                        <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.dataAiHint} />
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
            <div className="container mx-auto py-16 px-4 md:px-6">
                
                {/* Our Mission/Vision Section */}
                <section className="mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {values.map((value) => (
                           <div key={value.title} className="p-8 bg-card rounded-lg border border-border">
                                <h2 className="text-2xl font-bold font-headline mb-4 text-primary">{value.title}</h2>
                                <p className="text-muted-foreground text-lg">{value.description}</p>
                           </div>
                        ))}
                    </div>
                </section>

                {/* Team Section */}
                <section>
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold tracking-tight font-headline">Meet Our Team</h1>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
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
