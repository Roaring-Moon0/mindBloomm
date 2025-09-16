
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
}

let containerHeight = 450; // Default or SSR value

const BubbleComponent = ({ bubble, onPop, gameState }: { bubble: Bubble; onPop: (id: number) => void; gameState: string }) => {
  const controls = useAnimationControls();
  
  useEffect(() => {
    // Start animation on mount
    controls.start({
      y: -(containerHeight + bubble.size), // Animate off-screen
      transition: { duration: Math.random() * 6 + 9, ease: 'linear' }, // Slower: 9-15 seconds
    }).then(() => {
        // Clean up bubble when animation is complete
        onPop(bubble.id);
    });
  }, [controls, bubble.size, bubble.id, onPop]);

  useEffect(() => {
      if (gameState === 'paused') {
          controls.stop();
      } else if (gameState === 'playing') {
          controls.start({
            y: -(containerHeight + bubble.size)
          });
      }
  }, [gameState, controls, bubble.size]);

    return (
        <motion.div
            key={bubble.id}
            custom={bubble}
            animate={controls}
            initial={{ y: 0, x: bubble.x, opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
            className="absolute rounded-full bg-primary/30 border-2 border-primary/50 cursor-pointer flex items-center justify-center text-center p-2"
            style={{
                width: bubble.size,
                height: bubble.size,
                bottom: -bubble.size, // Start from just below the container
            }}
            onClick={() => onPop(bubble.id)}
        >
            <AnimatePresence>
                {!bubble.popped && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2, transition: { duration: 0.5 } }}
                        className="text-sm font-semibold text-primary-foreground/80 select-none text-center leading-tight whitespace-normal"
                    >
                        {bubble.text}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.div>
    );
};


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

    const size = Math.random() * 80 + 120; // 120 to 200px
    const newBubble = {
      id: nextId.current++,
      x: Math.random() * (container.offsetWidth - size),
      size,
      text: affirmations[Math.floor(Math.random() * affirmations.length)],
      popped: false,
    };
    
    setBubbles((prev) => [...prev, newBubble]);
  }, []);

  useEffect(() => {
    const startBubbleGenerator = () => {
        const burst = () => {
            const burstCount = Math.floor(Math.random() * 2) + 2; // 2-3 bubbles per burst
            for (let i = 0; i < burstCount; i++) {
                setTimeout(createBubble, i * 500); // Stagger bubble creation
            }
        };
        burst();
        intervalRef.current = setInterval(burst, 4000); // New burst every 4 seconds
    };

    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }

    if (gameState === 'playing') {
      startBubbleGenerator();
    } else if (gameState === 'stopped') {
       setBubbles([]);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameState, createBubble]);
  
  const handlePop = (id: number) => {
    setBubbles(prev => prev.map(b => b.id === id ? {...b, popped: true } : b));
    setTimeout(() => {
        setBubbles(prev => prev.filter(b => b.id !== id));
    }, 400); // Faster removal after pop
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
                gameState={gameState}
            />
          ))}
        </AnimatePresence>
      </CardContent>
       <CardFooter className="flex justify-center gap-4 pt-6">
        <Button onClick={handleStartPause}>
            {gameState === 'playing' ? <Pause className="mr-2 h-4 w-4"/> : <Play className="mr-2 h-4 w-4"/>}
            {gameState === 'playing' ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={handleStop} variant="destructive" disabled={gameState === 'stopped' && bubbles.length === 0}>
            <Square className="mr-2 h-4 w-4"/> Stop
        </Button>
      </CardFooter>
    </Card>
  );
}
