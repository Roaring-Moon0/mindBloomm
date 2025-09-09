import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HeartHandshake, Lightbulb, Target } from 'lucide-react';

const teamMembers = [
  { name: 'Aryan', role: 'Founder & Student & Leader', avatar: 'https://picsum.photos/id/1027/200/200', dataAiHint: 'man face', bio: 'A passionate student building tools to make mental health care accessible to all.', specialities: ['CBT', 'Mindfulness', 'Anxiety'] },
  { name: 'Member 2', role: 'Student', avatar: 'https://picsum.photos/id/1005/200/200', dataAiHint: 'person face', bio: 'A student and certified mindfulness instructor, guiding our meditation and relaxation content.', specialities: ['MBSR', 'Meditation', 'Stress Reduction'] },
  { name: 'Member 3', role: 'Student', avatar: 'https://picsum.photos/id/1011/200/200', dataAiHint: 'person face', bio: 'A student leading the technical team, ensuring our AI is both helpful and responsible.', specialities: ['AI Ethics', 'Product Management', 'NLP'] },
  { name: 'Member 4', role: 'Student', avatar: 'https://picsum.photos/id/1012/200/200', dataAiHint: 'person face', bio: 'A student who curates our resource library, ensuring content is evidence-based and easy to understand.', specialities: ['Content Curation', 'Writing'] },
  { name: 'Member 5', role: 'Student', avatar: 'https://picsum.photos/id/1025/200/200', dataAiHint: 'person face', bio: 'The creative student behind MindBloom\'s calming and intuitive design.', specialities: ['Accessible Design', 'UX'] },
  { name: 'Member 6', role: 'Student', avatar: 'https://picsum.photos/id/433/200/200', dataAiHint: 'person face', bio: 'A student fostering a safe and supportive environment for our user community.', specialities: ['Community Building', 'Support'] },
];

const values = [
    { icon: <HeartHandshake className="h-8 w-8 text-primary"/>, title: "Accessibility", description: "We believe everyone deserves access to quality mental health support, regardless of their circumstances." },
    { icon: <Target className="h-8 w-8 text-primary"/>, title: "Empathy", description: "Our approach is rooted in compassion and understanding for each individual's unique journey." },
    { icon: <Lightbulb className="h-8 w-8 text-primary"/>, title: "Integrity", description: "We are committed to providing evidence-based, responsible, and ethical tools and resources." },
]

export default function AboutPage() {
    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            {/* Mission Section */}
            <section className="text-center mb-16">
                <h1 className="text-4xl font-bold tracking-tight font-headline">Our Mission</h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    To empower individuals with accessible, compassionate, and effective tools to navigate their mental health journey, fostering a world where everyone can bloom.
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
                        <Card key={member.name} className="overflow-hidden text-center hover:shadow-lg transition-shadow">
                            <CardContent className="p-6 flex flex-col items-center">
                                <Avatar className="w-32 h-32 mb-4 border-4 border-primary/20">
                                    <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.dataAiHint} />
                                    <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <CardTitle className="text-xl">{member.name}</CardTitle>
                                <CardDescription>{member.role}</CardDescription>
                                <p className="text-muted-foreground text-sm mt-4 flex-grow">{member.bio}</p>
                                <div className="mt-4 flex flex-wrap justify-center gap-2">
                                    {member.specialities.map(spec => (
                                        <Badge key={spec} variant="secondary">{spec}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}
