
import Link from 'next/link';
import { ArrowRight, Flower, MessageSquareHeart, Gamepad2, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const resourceCategories = [
    { name: 'Focus & Concentration', href: '/resources' },
    { name: 'Overcoming Depression', href: '/resources' },
    { name: 'Better Sleep', href: '/resources' },
    { name: 'Daily Motivation', href: '/resources' },
    { name: 'Anxiety Relief', href: '/resources' },
    { name: 'Understanding Stress', href: '/resources' },
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
                        src="https://picsum.photos/seed/pink-flowers/600/400"
                        alt="A serene garden of pink flowers, symbolizing mental peace"
                        fill
                        data-ai-hint="pink flowers"
                        className="object-cover"
                        priority
                     />
                  </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <ParallaxSection className="w-full py-12 md:py-24 lg:py-32">
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
                      <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:scale-105 bg-card/80 backdrop-blur-sm">
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

        {/* Resources Preview */}
        <section id="resources-preview" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
          <FadeIn className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Explore Our Library</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Find helpful content across a wide range of mental health topics.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-4">
              {resourceCategories.map((category) => (
                <Button asChild variant="outline" size="lg" key={category.name}>
                    <Link href={category.href}>{category.name}</Link>
                </Button>
              ))}
            </div>
            <div className="mt-8">
                <Button asChild>
                    <Link href="/resources">
                        View All Resources <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
          </FadeIn>
        </section>

        {/* Team Preview */}
        <section id="team-preview" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <FadeIn className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Our Experts</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Meet the Team</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our team of dedicated professionals is here to support you.
                </p>
              </div>
            </FadeIn>
            <div className="mx-auto grid max-w-sm gap-8 sm:max-w-none sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              {teamMembers.slice(0,3).map((member, index) => (
                <FadeIn key={index} delay={0.1 * (index + 1)}>
                  <Card className="text-center flex flex-col items-center p-6 h-full">
                    <Avatar className="w-24 h-24 mb-4">
                      <AvatarImage src={member.avatar} data-ai-hint={member.dataAiHint} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-muted-foreground">{member.role}</p>
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
                        <Input type="email" placeholder="Enter your email" className="max-w-lg flex-1" />
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
