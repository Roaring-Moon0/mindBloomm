"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, RotateCw } from 'lucide-react';

const generateRandomColor = () => {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 20 + 70); // 70-90% saturation
    const l = Math.floor(Math.random() * 20 + 60); // 60-80% lightness
    return `hsl(${h}, ${s}%, ${l}%)`;
};

const generateOptions = (targetColor: string) => {
    const options = [targetColor];
    while (options.length < 4) {
        const newColor = generateRandomColor();
        if (!options.includes(newColor)) {
            options.push(newColor);
        }
    }
    return options.sort(() => Math.random() - 0.5);
};


export function ColorMatch() {
    const [targetColor, setTargetColor] = useState('');
    const [options, setOptions] = useState<string[]>([]);
    const [message, setMessage] = useState('');
    const [score, setScore] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);

    const newRound = () => {
        setShowFeedback(false);
        setMessage('');
        const newTarget = generateRandomColor();
        setTargetColor(newTarget);
        setOptions(generateOptions(newTarget));
    };
    
    const restartGame = () => {
        setScore(0);
        newRound();
    }

    useEffect(() => {
        newRound();
    }, []);

    const handleOptionClick = (color: string) => {
        if (showFeedback) return;

        setShowFeedback(true);
        if (color === targetColor) {
            setMessage('Correct!');
            setScore(score + 1);
            setTimeout(newRound, 1500);
        } else {
            setMessage('Try Again!');
            setTimeout(() => {
                setScore(0);
                restartGame();
            }, 1500);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline">Color Match</CardTitle>
                <CardDescription>Match the color to the swatch. Current score: {score}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-8 p-8">
                <div className="w-32 h-32 rounded-lg" style={{ backgroundColor: targetColor }} />
                
                <div className="grid grid-cols-2 gap-4">
                    {options.map((color, index) => (
                        <button
                            key={index}
                            onClick={() => handleOptionClick(color)}
                            className="w-24 h-24 rounded-lg transition-transform transform hover:scale-105"
                            style={{ backgroundColor: color }}
                            disabled={showFeedback}
                        />
                    ))}
                </div>

                {showFeedback ? (
                    <div className="flex items-center gap-2 font-semibold h-6">
                         {message === 'Correct!' ? <Check className="w-6 h-6 text-green-500"/> : <X className="w-6 h-6 text-red-500"/>}
                         <span>{message}</span>
                    </div>
                ): (
                    <div className="h-6">
                        <Button onClick={restartGame} variant="outline" size="sm"><RotateCw className="mr-2 h-4 w-4"/>Restart Game</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
