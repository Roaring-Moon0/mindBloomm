
import Link from 'next/link';
import { ArrowRight, Flower, MessageSquareHeart, Gamepad2, FileQuestion, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FadeIn } from '@/components/ui/fade-in';
import { FloatingPetals } from '@/components/ui/floating-petals';
import Image from 'next/image';
import { ParallaxSection } from '@/components/ui/parallax-section';


const features = [
  {
    icon: <Flower className="h-8 w-8 text-primary" />,
    title: 'Resource Library',
    description: 'Explore articles, videos, and audio on anxiety, depression, and stress management.',
    href: '/resources',
  },
  {
    icon: <MessageSquareHeart className="h-8 w-8 text-primary" />,
    title: 'AI Companion "Bloom"',
    description: 'Get empathetic responses and coping strategies from our AI tool.',
    href: '/chat',
  },
  {
    icon: <Gamepad2 className="h-8 w-8 text-primary" />,
    title: 'Calming Games',
    description: 'Reduce anxiety and promote relaxation with our selection of mini-games.',
    href: '/games',
  },
  {
    icon: <FileQuestion className="h-8 w-8 text-primary" />,
    title: 'Community Survey',
    description: 'Share your feedback to help us improve our platform and support.',
    href: '/survey',
  },
];

const teamMembers = [
  { name: 'Aryan', role: 'Founder & Leader', avatar: '/assets/aryan.png', dataAiHint: 'anime man' },
  { name: 'Gaurav', role: 'Resources Provider', avatar: '/assets/gaurav.png', dataAiHint: 'person face' },
  { name: 'Kartik', role: 'Tester', avatar: '/assets/kartik.png', dataAiHint: 'person face' },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-48 bg-primary/10 overflow-hidden">
          <FloatingPetals />
          <div className="container px-4 md:px-6 z-10 relative">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
                <FadeIn>
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    A Digital Support System for Students in Higher Education
                  </h1>
                  <p className="max-w-[600px] mx-auto lg:mx-0 text-muted-foreground md:text-xl">
                    MindBloom is a digital sanctuary for mental wellness, providing accessible, and stigma-free support to help students navigate life's challenges.
                  </p>
                </FadeIn>
                <FadeIn delay={0.1}>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start">
                    <Button asChild size="lg">
                      <Link href="/resources">Explore Resources</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                       <Link href="/chat">Chat with Bloom</Link>
                    </Button>
                  </div>
                </FadeIn>
              </div>
              <FadeIn className="relative min-h-[300px] lg:min-h-0">
                  <div className="relative mx-auto aspect-video overflow-hidden rounded-xl z-10 shadow-xl">
                     <Image
                        src="/assets/img.png"
                        alt="A serene, magical garden with glowing flowers and a peaceful ambiance"
                        fill
                        className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                        priority
                     />
                  </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <ParallaxSection
          className="w-full py-12 md:py-24 lg:py-32"
          imageUrl="https://picsum.photos/seed/flower-garden/1200/800"
          data-ai-hint="flower garden"
        >
          <div className="container px-4 md:px-6">
            <FadeIn className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">A Path to a Healthier Mind</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform offers a suite of tools designed to support your mental health journey, from guided meditations to AI-powered conversations.
                </p>
              </div>
            </FadeIn>
            <div className="mx-auto grid max-w-sm gap-8 sm:max-w-none sm:grid-cols-2 lg:grid-cols-4 mt-12">
              {features.map((feature, index) => (
                <FadeIn key={index} delay={0.1 * (index + 1)} className="flex flex-col">
                  <Link href={feature.href} className="block h-full w-full">
                      <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:scale-105 bg-card/80 backdrop-blur-sm rounded-xl">
                          <CardHeader className="flex flex-col items-center text-center gap-4">
                              {feature.icon}
                              <CardTitle>{feature.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="text-center text-muted-foreground flex-grow">
                              {feature.description}
                          </CardContent>
                      </Card>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </ParallaxSection>

        {/* New Discover Section */}
        <section id="discover-resources" className="relative w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-background overflow-hidden">
          <FloatingPetals />
          <FadeIn className="container grid items-center justify-center gap-6 px-4 text-center md:px-6 z-10 relative">
            <div className="space-y-3">
              <Flower className="mx-auto h-12 w-12 text-primary" />
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Discover New Resources</h2>
              <blockquote className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed italic">
                "The beautiful thing about learning is that nobody can take it away from you."
                <cite className="block not-italic font-semibold mt-2">- B.B. King</cite>
              </blockquote>
            </div>
            <form action="/resources" method="GET" className="mx-auto w-full max-w-lg flex items-center space-x-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="search"
                        name="q"
                        placeholder="Search for topics like 'mindfulness'..."
                        className="w-full pl-10 h-12 text-base rounded-lg"
                    />
                </div>
                <Button type="submit" size="lg" className="h-12 transition-transform duration-200 hover:scale-105 rounded-lg">
                    Search
                </Button>
            </form>
          </FadeIn>
        </section>

        {/* Team Preview */}
        <section id="team-preview" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <FadeIn className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-base font-semibold text-primary transition-colors hover:bg-primary/20">
                    <Users className="h-5 w-5" />
                    <span>Our Experts</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Meet the Team</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our team is here to support you.
                </p>
              </div>
            </FadeIn>
            <div className="mx-auto grid max-w-sm gap-8 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3 mt-12">
              {teamMembers.slice(0,3).map((member, index) => (
                <FadeIn key={index} delay={0.1 * (index + 1)}>
                  <Card className="h-full overflow-hidden text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 border-transparent hover:border-primary/50 bg-card rounded-xl">
                    <CardContent className="p-6 flex flex-col items-center">
                        <Avatar className="w-24 h-24 mb-4 border-4 border-primary/20 shadow-sm">
                          <AvatarImage src={member.avatar} data-ai-hint={member.dataAiHint} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-xl">{member.name}</CardTitle>
                        <CardDescription>{member.role}</CardDescription>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
            <FadeIn className="text-center mt-12">
                <Button asChild variant="outline">
                    <Link href="/about">
                        More About Us <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
              </Button>
            </FadeIn>
          </div>
        </section>

        {/* Chat CTA */}
        <section id="chat-cta" className="w-full py-12 md:py-24 lg:py-32 bg-primary/10">
          <FadeIn className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Ready to Talk?</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our AI companion, Bloom, is available 24/7 to provide a listening ear and helpful suggestions.
                <br />
                <span className="text-xs">Disclaimer: The AI is not a substitute for professional medical advice.</span>
              </p>
            </div>
            <Button asChild size="lg">
                <Link href="/chat">Start a Conversation</Link>
            </Button>
          </FadeIn>
        </section>

        {/* Newsletter Signup */}
        <section id="newsletter" className="w-full py-12 md:py-24 lg_py-32">
            <FadeIn className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Stay in Touch</h2>
                    <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Subscribe to our newsletter for weekly wellness tips and updates.
                    </p>
                </div>
                <div className="mx-auto w-full max-w-sm space-y-2">
                    <form className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Input type="email" placeholder="Enter your email" className="max-w-lg flex-1 rounded-lg" />
                        <Button type="submit">Subscribe</Button>
                    </form>
                    <p className="text-xs text-muted-foreground">
                        We respect your privacy. Unsubscribe at any time.
                    </p>
                </div>
            </FadeIn>
        </section>

      </main>
    </div>
  );
}
