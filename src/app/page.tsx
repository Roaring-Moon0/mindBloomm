import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf, MessageSquareHeart, Gamepad2, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const features = [
  {
    icon: <Leaf className="h-8 w-8 text-primary" />,
    title: 'Resource Library',
    description: 'Explore articles, videos, and audio on anxiety, depression, and stress management.',
    href: '/resources',
  },
  {
    icon: <MessageSquareHeart className="h-8 w-8 text-primary" />,
    title: 'AI Chat Assistant',
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
    icon: <HeartHandshake className="h-8 w-8 text-primary" />,
    title: 'Guided Meditations',
    description: 'Cultivate mindfulness and reduce anxiety with our guided exercises.',
    href: '/resources',
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
  { name: 'Dr. Evelyn Reed', role: 'Lead Psychologist', avatar: 'https://picsum.photos/id/1027/100/100', dataAiHint: 'woman face' },
  { name: 'Alex Chen', role: 'Mindfulness Expert', avatar: 'https://picsum.photos/id/1005/100/100', dataAiHint: 'man face' },
  { name: 'Maria Garcia', role: 'AI Specialist', avatar: 'https://picsum.photos/id/1011/100/100', dataAiHint: 'woman face' },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary/10">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Find Your Calm, Bloom Into You
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    MindBloom is your personal sanctuary for mental wellness. Discover resources, tools, and support to help you navigate life's challenges.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/resources">Explore Resources</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                     <Link href="/chat">Talk to AI Assistant</Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://picsum.photos/id/225/1200/800"
                width={1200}
                height={800}
                alt="Calm natural scenery"
                data-ai-hint="calm nature"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">A Path to a Healthier Mind</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform offers a suite of tools designed to support your mental health journey, from guided meditations to AI-powered conversations.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-4 mt-12">
              {features.map((feature, index) => (
                <Link href={feature.href} key={index} className="block h-full">
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="flex flex-col items-center text-center gap-4">
                            {feature.icon}
                            <CardTitle>{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center text-muted-foreground">
                            {feature.description}
                        </CardContent>
                    </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Resources Preview */}
        <section id="resources-preview" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Explore Our Library</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Find helpful content across a wide range of mental health topics.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
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
          </div>
        </section>

        {/* Team Preview */}
        <section id="team-preview" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Our Experts</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Meet the Team</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our team of dedicated professionals is here to support you.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 mt-12">
              {teamMembers.map((member, index) => (
                <Card key={index} className="text-center flex flex-col items-center p-6">
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src={member.avatar} data-ai-hint={member.dataAiHint} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <p className="text-muted-foreground">{member.role}</p>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
                <Button asChild variant="outline">
                    <Link href="/about">
                        More About Us <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Chat CTA */}
        <section id="chat-cta" className="w-full py-12 md:py-24 lg:py-32 bg-primary/10">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Ready to Talk?</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our AI assistant is available 24/7 to provide a listening ear and helpful suggestions.
                <br />
                <span className="text-xs">Disclaimer: The AI is not a substitute for professional medical advice.</span>
              </p>
            </div>
            <Button asChild size="lg">
                <Link href="/chat">Start a Conversation</Link>
            </Button>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section id="newsletter" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Stay in Touch</h2>
                    <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Subscribe to our newsletter for weekly wellness tips and updates.
                    </p>
                </div>
                <div className="mx-auto w-full max-w-sm space-y-2">
                    <form className="flex space-x-2">
                        <Input type="email" placeholder="Enter your email" className="max-w-lg flex-1" />
                        <Button type="submit">Subscribe</Button>
                    </form>
                    <p className="text-xs text-muted-foreground">
                        We respect your privacy. Unsubscribe at any time.
                    </p>
                </div>
            </div>
        </section>

      </main>
    </div>
  );
}
