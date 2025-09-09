"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function BreathingVisualizer() {
  const [isBreathing, setIsBreathing] = useState(false);
  const [text, setText] = useState('Begin');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBreathing) {
      const cycle = () => {
        setText('Inhale');
        timer = setTimeout(() => {
          setText('Exhale');
        }, 4000); // Inhale for 4 seconds
      };
      cycle();
      const interval = setInterval(cycle, 10000); // Full cycle is 10 seconds
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    } else {
      setText('Begin');
    }
  }, [isBreathing]);

  return (
    <Card className="w-full max-w-md mx-auto border-2 border-primary/20 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Breathing Exercise</CardTitle>
        <CardDescription>Follow the circle to guide your breath and find calm.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-8 p-8">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <div
            className={cn(
              'absolute w-full h-full rounded-full bg-primary/20',
              isBreathing && 'animate-pulse-slow'
            )}
            style={{animationDuration: isBreathing ? '10s' : '0s'}}
          />
          <div
            className={cn(
              'w-24 h-24 rounded-full bg-primary flex items-center justify-center',
              isBreathing && 'animate-breathe'
            )}
          >
             <span className="text-lg font-semibold text-primary-foreground z-10">{text}</span>
          </div>
        </div>
        <Button onClick={() => setIsBreathing(!isBreathing)} size="lg" className="w-32">
          {isBreathing ? 'Stop' : 'Start'}
        </Button>
      </CardContent>
    </Card>
  );
}
