
"use client";

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import type { ReactNode } from 'react';

interface ParallaxSectionProps {
  children: ReactNode;
  imageUrl?: string;
  className?: string;
}

export function ParallaxSection({ 
  children, 
  imageUrl = "https://picsum.photos/seed/parallaxbg/1200/800",
  className 
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <Image
          src={imageUrl}
          alt="Parallax background"
          fill
          data-ai-hint="abstract background"
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-background/60" />
      </motion.div>
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}
