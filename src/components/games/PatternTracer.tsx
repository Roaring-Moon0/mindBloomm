"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Rewind, FastForward } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const patterns = [
    { name: 'Circle', path: 'M150 150 m -100, 0 a 100,100 0 1,0 200,0 a 100,100 0 1,0 -200,0' },
    { name: 'Infinity', path: 'M100,150 C100,100 200,100 200,150 C200,200 100,200 100,150 C100,100 0,100 0,150 C0,200 100,200 100,150 Z' },
    { name: 'Star', path: 'M150 50 L179 119 L250 129 L195 180 L211 250 L150 212 L89 250 L105 180 L50 129 L121 119 Z' },
    { name: 'Spiral', path: 'M150,150 C 150,150 200,150 200,150 C 200,150 200,200 200,200 C 200,200 100,200 100,200 C 100,200 100,100 100,100 C 100,100 250,100 250,100 C 250,100 250,250 250,250 C 250,250 50,250 50,250 C 50,250 50,50 50,50' },
];

export function PatternTracer() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [patternIndex, setPatternIndex] = useState(0);
    const [completion, setCompletion] = useState(0);

    const patternPath = useMemo(() => new Path2D(patterns[patternIndex].path), [patternIndex]);

    const drawPattern = (ctx: CanvasRenderingContext2D, color: string, width: number) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke(patternPath);
    };

    const resetCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPattern(ctx, '#e5e7eb', 15); // Faint background pattern
        setCompletion(0);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const { width } = canvas.getBoundingClientRect();
            canvas.width = 300;
            canvas.height = 300;
            resetCanvas();
        }
    }, [patternIndex, patternPath]);

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

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const coords = getCoords(e);
        if (!coords) return;
        
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        
        setIsDrawing(true);
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
        ctx.strokeStyle = 'hsl(var(--primary))';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const coords = getCoords(e);
        if (!coords) return;

        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();

        // Very basic completion check
        if (ctx.isPointInStroke(patternPath, coords.x, coords.y)) {
             setCompletion(prev => Math.min(100, prev + 0.5));
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const changePattern = (direction: 'next' | 'prev') => {
        const newIndex = direction === 'next'
            ? (patternIndex + 1) % patterns.length
            : (patternIndex - 1 + patterns.length) % patterns.length;
        setPatternIndex(newIndex);
    };

    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline">Pattern Tracer</CardTitle>
                <CardDescription>Trace the shape to focus your mind. Pattern: {patterns[patternIndex].name}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4 p-4">
                 <div className="bg-background rounded-lg border p-2">
                    <canvas
                        ref={canvasRef}
                        className="cursor-pointer"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                    />
                </div>

                <div className="w-full px-4">
                     <Progress value={completion} className="h-2" />
                     <p className="text-xs text-center mt-1 text-muted-foreground">{Math.round(completion)}% Complete</p>
                </div>
               
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => changePattern('prev')}><Rewind /></Button>
                    <Button variant="destructive" onClick={resetCanvas}><Trash2 className="mr-2 h-4 w-4"/> Clear</Button>
                    <Button variant="outline" size="icon" onClick={() => changePattern('next')}><FastForward /></Button>
                </div>
            </CardContent>
        </Card>
    );
}
