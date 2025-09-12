import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf, Users, Heart, Sparkles, MessageSquareHeart, Gamepad2, FileQuestion, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeIn } from '@/components/ui/fade-in';
import { FloatingPetals } from '@/components/ui/floating-petals';


const features = [
  {
    icon: <Heart className="h-8 w-8 text-primary" />,
    title: 'Safe Space',
    description: 'A judgment-free zone for you to explore your feelings.',
    href: '/chat',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Community',
    description: 'Connect with peers who understand what you\'re going through.',
    href: '/#',
  },
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: 'Growth',
    description: 'Tools and resources for your personal development journey.',
    href: '/resources',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-28 lg:py-36 xl:py-44">
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-0" />
          <Image
            src="https://picsum.photos/seed/lake-sunrise/1920/1080"
            alt="Calm lake at sunrise"
            data-ai-hint="calm lake sunrise"
            fill
            className="object-cover -z-10"
            priority
          />
           <FloatingPetals />
          <div className="container px-4 md:px-6 z-10 relative">
            <FadeIn className="max-w-3xl text-center mx-auto">
              <div className="flex items-center gap-2 text-primary-foreground font-medium justify-center bg-black/30 rounded-full px-4 py-1 mb-4 w-fit mx-auto">
                <Leaf className="w-5 h-5"/>
                Your Journey to a Healthier Mind Starts Here
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white font-headline shadow-lg">
                Find Your Calm with MindBloom
              </h1>
              <p className="max-w-[600px] text-primary-foreground mx-auto md:text-xl mt-6 font-medium">
                A digital sanctuary designed to provide students with accessible, compassionate, and stigma-free tools for mental wellness.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/dashboard">Explore Features <ArrowRight className="ml-2 h-5 w-5"/></Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                   <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
             <FadeIn className="text-center max-w-2xl mx-auto mb-16">
                 <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">What We Offer</h2>
                <p className="text-muted-foreground md:text-xl/relaxed mt-4">
                    MindBloom is more than just an app—it's your partner in navigating the ups and downs of student life.
                </p>
            </FadeIn>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:gap-12 lg:grid-cols-3">
              <FadeIn delay={0.1} className="grid gap-1 text-center">
                 <div className="flex justify-center items-center mb-4">
                    <MessageSquareHeart className="w-12 h-12 text-primary"/>
                 </div>
                <h3 className="text-xl font-bold">AI Companion "Bloom"</h3>
                <p className="text-muted-foreground">
                  Get empathetic support and personalized recommendations from our friendly AI assistant, available 24/7.
                </p>
              </FadeIn>
               <FadeIn delay={0.2} className="grid gap-1 text-center">
                 <div className="flex justify-center items-center mb-4">
                    <Gamepad2 className="w-12 h-12 text-primary"/>
                 </div>
                <h3 className="text-xl font-bold">Calming Mini-Games</h3>
                <p className="text-muted-foreground">
                  De-stress with a collection of simple, satisfying games designed to promote mindfulness and relaxation.
                </p>
              </FadeIn>
              <FadeIn delay={0.3} className="grid gap-1 text-center">
                 <div className="flex justify-center items-center mb-4">
                    <FileQuestion className="w-12 h-12 text-primary"/>
                 </div>
                <h3 className="text-xl font-bold">Curated Resources</h3>
                <p className="text-muted-foreground">
                  Explore a rich library of articles, videos, and music focused on topics like anxiety, stress, and sleep.
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

         {/* About Section */}
        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
          <FadeIn className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
               <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Our Mission</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Your Partner in Mental Wellness</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We're dedicated to providing students with accessible, compassionate, and stigma-free tools to navigate their mental health journey.
              </p>
            </div>
            <div className="mt-8">
                <Button asChild variant="outline">
                    <Link href="/about">
                        Learn More About Us <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
          </FadeIn>
        </section>

      </main>
    </div>
  );
}
