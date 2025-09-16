"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hand, Gem, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tool = 'rake' | 'stone';
interface Stone {
  x: number;
  y: number;
  radius: number;
}

export function ZenGarden() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('rake');
  const [stones, setStones] = useState<Stone[]>([]);

  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d');
  };

  const clearCanvas = () => {
    const ctx = getCanvasContext();
    const canvas = canvasRef.current;
    if (ctx && canvas) {
      ctx.fillStyle = '#f4f1eb'; // Sand color
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setStones([]);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Set initial size
      const { width } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = width * 0.75; // 4:3 aspect ratio
      clearCanvas();
    }
  }, []);

  const getCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startRaking = (e: React.MouseEvent | React.TouchEvent) => {
    if (tool !== 'rake') return;
    const coords = getCoords(e);
    if (!coords) return;
    
    const ctx = getCanvasContext();
    if (!ctx) return;
    
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.strokeStyle = '#e0dcd3';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  };

  const rake = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || tool !== 'rake') return;
    const coords = getCoords(e);
    if (!coords) return;

    const ctx = getCanvasContext();
    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopRaking = () => {
    const ctx = getCanvasContext();
    if (ctx) {
      ctx.closePath();
    }
    setIsDrawing(false);
  };
  
  const placeStone = (e: React.MouseEvent | React.TouchEvent) => {
    if (tool !== 'stone') return;
    const coords = getCoords(e);
    if (!coords) return;

    const newStone: Stone = {
      x: coords.x,
      y: coords.y,
      radius: Math.random() * 10 + 10, // 10 to 20 radius
    };
    
    const updatedStones = [...stones, newStone];
    setStones(updatedStones);
    drawStones(updatedStones);
  };

  const drawStones = (stonesToDraw: Stone[]) => {
    const ctx = getCanvasContext();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    // Redraw sand to not clear rake lines under stones
    stonesToDraw.forEach(stone => {
        ctx.beginPath();
        ctx.arc(stone.x, stone.y, stone.radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#f4f1eb';
        ctx.fill();
    });

    // Redraw stones
    stonesToDraw.forEach(stone => {
        ctx.beginPath();
        ctx.arc(stone.x, stone.y, stone.radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#a8a29e'; // Stone color
        ctx.fill();
        ctx.strokeStyle = '#78716c';
        ctx.lineWidth = 1;
        ctx.stroke();
    });
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Zen Garden</CardTitle>
        <CardDescription>Rake sand and place stones to find your moment of calm.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4 p-4">
        <canvas
          ref={canvasRef}
          className="rounded-lg cursor-crosshair bg-[#f4f1eb]"
          onMouseDown={startRaking}
          onMouseMove={rake}
          onMouseUp={stopRaking}
          onMouseLeave={stopRaking}
          onTouchStart={startRaking}
          onTouchMove={rake}
          onTouchEnd={stopRaking}
          onClick={placeStone}
        />
        <div className="flex items-center gap-4">
          <Button
            variant={tool === 'rake' ? 'default' : 'outline'}
            onClick={() => setTool('rake')}
          >
            <Hand className="mr-2 h-4 w-4" /> Rake
          </Button>
          <Button
            variant={tool === 'stone' ? 'default' : 'outline'}
            onClick={() => setTool('stone')}
          >
            <Gem className="mr-2 h-4 w-4" /> Stone
          </Button>
          <Button variant="destructive" onClick={clearCanvas}>
            <Trash2 className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
