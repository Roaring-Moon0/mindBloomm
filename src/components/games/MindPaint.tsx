
'use client';

import * as React from 'react';
import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Eraser, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const colors = [
  '#FFC107', '#FF5722', '#F44336', '#E91E63', '#9C27B0',
  '#3F51B5', '#2196F3', '#00BCD4', '#4CAF50', '#8BC34A', '#CDDC39',
];

const DEFAULT_COLOR = '#4A4A4A';
const ERASER_COLOR = '#FFFFFF';

export function MindPaint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState(DEFAULT_COLOR);
  const [brushSize, setBrushSize] = useState(5);
  const isMobile = useIsMobile();

  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    return canvas?.getContext('2d');
  };

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const { width, height } = container.getBoundingClientRect();
      
      // Preserve drawing
      const ctx = getCanvasContext();
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);

      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        // Restore drawing
        if(imageData) ctx.putImageData(imageData, 0, 0);

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);
    
    // Initial clear
    const ctx = getCanvasContext();
    if(ctx){
        ctx.fillStyle = ERASER_COLOR;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
    
    resizeCanvas();

    return () => resizeObserver.disconnect();
  }, []);

  const getEventPosition = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e.nativeEvent) {
      const touch = e.nativeEvent.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const ctx = getCanvasContext();
    if (!ctx) return;
    
    setIsDrawing(true);
    const pos = getEventPosition(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = getCanvasContext();
    if (!ctx) return;

    if ('touches' in e.nativeEvent) {
      e.preventDefault();
    }

    ctx.lineWidth = brushSize;
    ctx.strokeStyle = brushColor;
    
    const pos = getEventPosition(e);
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

  const setEraser = () => setBrushColor(ERASER_COLOR);
  const setPencil = () => setBrushColor(DEFAULT_COLOR);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-4 p-2 sm:p-4">
        <h2 className="text-xl sm:text-2xl font-bold font-headline hidden sm:block">Mind Paint</h2>
        <div ref={containerRef} className="w-full flex-1 relative">
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full bg-white rounded-lg shadow-inner cursor-crosshair border"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
            />
        </div>
        <div className="w-full space-y-4 pt-2 flex-shrink-0">
            {/* Color Palette */}
            <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                {colors.map(color => (
                    <button
                        key={color}
                        onClick={() => setBrushColor(color)}
                        className={cn(
                            "w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-transform transform hover:scale-110 border-2",
                            brushColor === color ? 'border-primary' : 'border-transparent'
                        )}
                        style={{ backgroundColor: color }}
                        aria-label={`Set color to ${color}`}
                    />
                ))}
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 items-center">
                <div className="flex items-center gap-2">
                    <label className="text-xs sm:text-sm font-medium">Size</label>
                    <Slider
                        min={2}
                        max={isMobile ? 20 : 30}
                        step={1}
                        value={[brushSize]}
                        onValueChange={(value) => setBrushSize(value[0])}
                    />
                </div>
                <div className="flex justify-end gap-1 sm:gap-2">
                    <Button variant={brushColor === DEFAULT_COLOR ? 'secondary' : 'outline'} size="icon" onClick={setPencil} title="Pencil">
                        <Pencil className="w-4 h-4 sm:w-5 sm:h-5"/>
                    </Button>
                    <Button variant={brushColor === ERASER_COLOR ? 'secondary' : 'outline'} size="icon" onClick={setEraser} title="Eraser">
                        <Eraser className="w-4 h-4 sm:w-5 sm:h-5"/>
                    </Button>
                    <Button variant="destructive" onClick={clearCanvas} className="text-xs px-2 sm:text-sm sm:px-4">Clear</Button>
                </div>
            </div>
        </div>
    </div>
  );
}
