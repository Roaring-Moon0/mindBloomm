
"use client";

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Eraser, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

const colors = [
  '#FFC107', '#FF5722', '#F44336', '#E91E63', '#9C27B0',
  '#3F51B5', '#2196F3', '#00BCD4', '#4CAF50', '#8BC34A', '#CDDC39',
];

const DEFAULT_COLOR = '#4A4A4A';
const ERASER_COLOR = '#FFFFFF'; // The canvas background color

export function MindPaint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState(DEFAULT_COLOR);
  const [brushSize, setBrushSize] = useState(5);

  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    return canvas?.getContext('2d');
  };

  useEffect(() => {
    const ctx = getCanvasContext();
    if (ctx) {
      ctx.fillStyle = ERASER_COLOR;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  }, []);


  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const ctx = getCanvasContext();
    if (!ctx) return;
    
    setIsDrawing(true);
    ctx.beginPath();

    const pos = e.nativeEvent instanceof MouseEvent ? { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY } : { x: e.nativeEvent.touches[0].clientX - canvasRef.current!.offsetLeft, y: e.nativeEvent.touches[0].clientY - canvasRef.current!.offsetTop };

    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = getCanvasContext();
    if (!ctx) return;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = brushColor;
    
    const pos = e.nativeEvent instanceof MouseEvent ? { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY } : { x: e.nativeEvent.touches[0].clientX - canvasRef.current!.offsetLeft, y: e.nativeEvent.touches[0].clientY - canvasRef.current!.offsetTop };

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const ctx = getCanvasContext();
    if (!ctx) return;
    
    ctx.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const ctx = getCanvasContext();
    if (ctx) {
      ctx.fillStyle = ERASER_COLOR;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  };

  const setEraser = () => {
    setBrushColor(ERASER_COLOR);
  };
  
  const setPencil = () => {
    setBrushColor(DEFAULT_COLOR);
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
        <h2 className="text-2xl font-bold font-headline">Mind Paint</h2>
        <p className="text-muted-foreground">Let your creativity flow. Draw whatever comes to mind.</p>
        <canvas
            ref={canvasRef}
            width={550}
            height={400}
            className="bg-white rounded-lg shadow-inner cursor-crosshair border"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
        />
        <div className="w-full space-y-4 pt-2">
            {/* Color Palette */}
            <div className="flex flex-wrap justify-center gap-2">
                {colors.map(color => (
                    <button
                        key={color}
                        onClick={() => setBrushColor(color)}
                        className={cn(
                            "w-8 h-8 rounded-full transition-transform transform hover:scale-110 border-2",
                            brushColor === color ? 'border-primary' : 'border-transparent'
                        )}
                        style={{ backgroundColor: color }}
                        aria-label={`Set color to ${color}`}
                    />
                ))}
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4 items-center">
                    <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Size</label>
                    <Slider
                        min={2}
                        max={30}
                        step={1}
                        value={[brushSize]}
                        onValueChange={(value) => setBrushSize(value[0])}
                    />
                    </div>
                    <div className="flex justify-end gap-2">
                    <Button variant={brushColor === DEFAULT_COLOR ? 'secondary' : 'outline'} size="icon" onClick={setPencil} title="Pencil">
                        <Pencil />
                    </Button>
                    <Button variant={brushColor === ERASER_COLOR ? 'secondary' : 'outline'} size="icon" onClick={setEraser} title="Eraser">
                        <Eraser />
                    </Button>
                    <Button variant="destructive" onClick={clearCanvas}>Clear</Button>
                    </div>
            </div>
        </div>
    </div>
  );
}
