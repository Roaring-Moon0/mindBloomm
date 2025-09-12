import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MessageSquareHeart, Gamepad2, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeIn } from '@/components/ui/fade-in';
import Logo from '@/components/icons/Logo';


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-28 md:py-40 lg:py-56 bg-background">
          <div className="container px-4 md:px-6 z-10 relative">
            <FadeIn className="max-w-4xl text-center mx-auto">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-foreground font-headline">
                Welcome to your safe space
              </h1>
              <h2 className="mt-4 text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter">
                <span className="text-muted-foreground">Mind</span>
                <span className="text-primary">Bloom</span>
              </h2>
              <p className="max-w-2xl text-muted-foreground mx-auto md:text-xl mt-6">
                A digital sanctuary designed to provide students with accessible, compassionate, and stigma-free tools for mental wellness.
              </p>
              <div className="mt-10 flex justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/dashboard">Start Your Journey <ArrowRight className="ml-2 h-5 w-5"/></Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                   <Link href="/about">Join Our Community</Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
             <FadeIn className="text-center max-w-3xl mx-auto mb-16">
                 <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">What We Offer</h2>
                <p className="text-muted-foreground md:text-xl/relaxed mt-4">
                    MindBloom is more than just an app—it's your partner in navigating the ups and downs of student life.
                </p>
            </FadeIn>
            <div className="mx-auto grid max-w-5xl items-stretch gap-8 sm:grid-cols-1 md:gap-12 lg:grid-cols-3">
              <FadeIn delay={0.1}>
                <Card className="h-full bg-card border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all">
                    <CardHeader className="items-center text-center">
                        <MessageSquareHeart className="w-12 h-12 text-primary mb-4"/>
                        <CardTitle className="text-xl font-bold">AI Companion "Bloom"</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-muted-foreground">
                            Get empathetic support and personalized recommendations from our friendly AI assistant, available 24/7.
                        </p>
                    </CardContent>
                </Card>
              </FadeIn>
               <FadeIn delay={0.2}>
                 <Card className="h-full bg-card border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all">
                    <CardHeader className="items-center text-center">
                        <Gamepad2 className="w-12 h-12 text-primary mb-4"/>
                        <CardTitle className="text-xl font-bold">Calming Mini-Games</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-muted-foreground">
                            De-stress with a collection of simple, satisfying games designed to promote mindfulness and relaxation.
                        </p>
                    </CardContent>
                </Card>
              </FadeIn>
              <FadeIn delay={0.3}>
                 <Card className="h-full bg-card border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all">
                    <CardHeader className="items-center text-center">
                        <FileQuestion className="w-12 h-12 text-primary mb-4"/>
                        <CardTitle className="text-xl font-bold">Curated Resources</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-muted-foreground">
                            Explore a rich library of articles, videos, and music focused on topics like anxiety, stress, and sleep.
                        </p>
                    </CardContent>
                </Card>
              </FadeIn>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
