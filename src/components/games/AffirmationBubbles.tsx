"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

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
  y: number;
  size: number;
  text: string;
}

export function AffirmationBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [poppedId, setPoppedId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  const createBubble = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const size = Math.random() * 60 + 80; // 80 to 140px
    const newBubble: Bubble = {
      id: nextId.current++,
      x: Math.random() * (container.offsetWidth - size),
      y: container.offsetHeight,
      size,
      text: affirmations[Math.floor(Math.random() * affirmations.length)],
    };
    setBubbles((prev) => [...prev, newBubble]);
  }, []);

  useEffect(() => {
    const interval = setInterval(createBubble, 2500);
    return () => clearInterval(interval);
  }, [createBubble]);
  
  const handlePop = (id: number) => {
    setPoppedId(id);
    setTimeout(() => {
        setBubbles(prev => prev.filter(b => b.id !== id));
        setPoppedId(null);
    }, 800);
  };

  return (
    <Card className="w-full max-w-lg mx-auto h-[500px] flex flex-col">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Affirmation Bubbles</CardTitle>
        <CardDescription>Pop the bubbles to reveal positive affirmations.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow relative w-full overflow-hidden" ref={containerRef}>
        <AnimatePresence>
          {bubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              initial={{ y: 0, x: bubble.x, opacity: 1, scale: 1 }}
              animate={{ y: -bubble.y - bubble.size }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: Math.random() * 6 + 9, ease: 'linear' }}
              onAnimationComplete={() => setBubbles(prev => prev.filter(b => b.id !== bubble.id))}
              className="absolute rounded-full bg-primary/30 border-2 border-primary/50 cursor-pointer flex items-center justify-center text-center p-2"
              style={{
                width: bubble.size,
                height: bubble.size,
                bottom: 0,
              }}
              onClick={() => handlePop(bubble.id)}
            >
              <AnimatePresence>
              {poppedId === bubble.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2, transition: { duration: 0.5 } }}
                    className="absolute inset-0 flex items-center justify-center p-2"
                  >
                    <span className="text-xs font-semibold text-primary-foreground/80 select-none text-center leading-tight">
                      {bubble.text}
                    </span>
                  </motion.div>
              )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
