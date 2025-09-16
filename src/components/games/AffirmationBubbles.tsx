
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import { Play, Pause, Square } from 'lucide-react';

const affirmations = [
  "I am calm and centered.",
  "I am worthy of love and respect.",
  "I release all that no longer serves me.",
  "I am capable of achieving my dreams.",
  "I trust the journey of my life.",
  "I am resilient and can handle any challenge.",
  "I choose to be happy and to love myself today.",
  "My possibilities are endless.",
  "I am in control of my thoughts and feelings.",
  "I am proud of who I am becoming.",
];

interface Bubble {
  id: number;
  x: number;
  size: number;
  text: string;
  popped: boolean;
  controls: any; // Animation controls for this specific bubble
}

const BubbleComponent = ({ bubble, onPop }: { bubble: Bubble; onPop: (id: number) => void; }) => {
  useEffect(() => {
    // Start animation on mount
    bubble.controls.start({
      y: -(containerHeight + bubble.size), // Animate off-screen
      transition: { duration: Math.random() * 6 + 9, ease: 'linear' },
    });
  }, [bubble.controls, bubble.size]);

    return (
        <motion.div
            key={bubble.id}
            custom={bubble}
            animate={bubble.controls}
            initial={{ y: 0, x: bubble.x, opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
            className="absolute rounded-full bg-primary/30 border-2 border-primary/50 cursor-pointer flex items-center justify-center text-center"
            style={{
                width: bubble.size,
                height: bubble.size,
                bottom: -bubble.size, // Start from just below the container
            }}
            onClick={() => onPop(bubble.id)}
        >
            <AnimatePresence>
                {bubble.popped && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2, transition: { duration: 0.5 } }}
                        className="absolute inset-0 flex items-center justify-center p-2"
                    >
                        <span className="text-sm font-semibold text-primary-foreground/80 select-none text-center leading-tight whitespace-normal">
                            {bubble.text}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

let containerHeight = 500; // Default or SSR value

export function AffirmationBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [gameState, setGameState] = useState<'stopped' | 'playing' | 'paused'>('stopped');
  const containerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (containerRef.current) {
        containerHeight = containerRef.current.offsetHeight;
    }
  }, []);

  const createBubble = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const size = Math.random() * 80 + 100; // 100 to 180px
    const newBubble = {
      id: nextId.current++,
      x: Math.random() * (container.offsetWidth - size),
      size,
      text: affirmations[Math.floor(Math.random() * affirmations.length)],
      popped: false,
      controls: useAnimationControls(),
    };
    
    // Add new bubble and set a timeout to remove it if it goes off-screen
    setBubbles((prev) => {
        const newBubbles = [...prev, newBubble];
        setTimeout(() => {
            setBubbles(current => current.filter(b => b.id !== newBubble.id));
        }, 15000); // Remove after 15s regardless
        return newBubbles;
    });

  }, []);

  useEffect(() => {
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }
    if (gameState === 'playing') {
      bubbles.forEach(b => b.controls.start({ y: -(containerHeight + b.size) }));
      intervalRef.current = setInterval(createBubble, 2500);
    } else if (gameState === 'paused') {
      bubbles.forEach(b => b.controls.stop());
    } else if (gameState === 'stopped') {
       setBubbles([]);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameState]);
  
  const handlePop = (id: number) => {
    setBubbles(prev => prev.map(b => b.id === id ? {...b, popped: true } : b));
    setTimeout(() => {
        setBubbles(prev => prev.filter(b => b.id !== id));
    }, 800);
  };
  
  const handleStop = () => {
      setGameState('stopped');
  };

  const handleStartPause = () => {
      if (gameState === 'playing') {
          setGameState('paused');
      } else {
          setGameState('playing');
      }
  };


  return (
    <Card className="w-full max-w-lg mx-auto h-full flex flex-col">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Affirmation Bubbles</CardTitle>
        <CardDescription>Pop the bubbles to reveal positive affirmations.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow relative w-full overflow-hidden" ref={containerRef}>
        <AnimatePresence>
          {bubbles.map((bubble) => (
             <BubbleComponent 
                key={bubble.id}
                bubble={bubble} 
                onPop={handlePop} 
            />
          ))}
        </AnimatePresence>
      </CardContent>
       <CardFooter className="flex justify-center gap-4 pt-6">
        <Button onClick={handleStartPause} disabled={gameState === 'stopped' && bubbles.length > 0}>
            {gameState === 'playing' ? <Pause className="mr-2 h-4 w-4"/> : <Play className="mr-2 h-4 w-4"/>}
            {gameState === 'playing' ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={handleStop} variant="destructive" disabled={gameState === 'stopped'}>
            <Square className="mr-2 h-4 w-4"/> Stop
        </Button>
      </CardFooter>
    </Card>
  );
}
