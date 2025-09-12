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
          <div className="container px-4 md:px-6 z-10 relative">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-6">
                <FadeIn>
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <Sparkles className="w-5 h-5 text-accent-foreground"/>
                    Welcome to Your Safe Space
                  </div>
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Mind<span className="text-accent-foreground">Bloom</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    A magical treehouse where students find peace, support, and tools for mental wellness. Your journey to emotional growth starts here.
                  </p>
                </FadeIn>
                <FadeIn delay={0.1}>
                  <div className="flex flex-col gap-4 min-[400px]:flex-row">
                    <Button asChild size="lg">
                      <Link href="/dashboard"><Heart className="mr-2 h-5 w-5"/> Start Your Journey</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                       <Link href="#">Join Our Community</Link>
                    </Button>
                  </div>
                </FadeIn>
              </div>
              <FadeIn className="flex items-center justify-center">
                <Image
                  src="/assets/treehouse.png"
                  width={500}
                  height={500}
                  alt="A magical treehouse representing a safe space for mental growth"
                  data-ai-hint="treehouse illustration"
                  className="mx-auto"
                />
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full pb-12 md:pb-24 lg:pb-32 pt-10">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-stretch gap-6 sm:grid-cols-2 md:gap-8 lg:max-w-none lg:grid-cols-3">
              {features.map((feature, index) => (
                <FadeIn key={index} delay={0.1 * (index + 1)} className="flex flex-col">
                  <Link href={feature.href} className="block h-full w-full">
                      <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:scale-105">
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
        </section>

         {/* About Section */}
        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
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
