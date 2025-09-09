
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BrainCircuit, Heart, Leaf, Smile, Star, Sun, Zap, Anchor } from 'lucide-react';

const icons = [
    <BrainCircuit key="brain" />, <Heart key="heart"/>, <Leaf key="leaf"/>, <Smile key="smile"/>, 
    <Star key="star"/>, <Sun key="sun"/>, <Zap key="zap"/>, <Anchor key="anchor"/>
];

const createBoard = () => {
    const duplicatedIcons = [...icons, ...icons];
    return duplicatedIcons
        .map(icon => ({ icon, isFlipped: false, isMatched: false }))
        .sort(() => Math.random() - 0.5);
}

export function MemoryGame() {
    const [board, setBoard] = useState(createBoard());
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const resetGame = () => {
        setBoard(createBoard());
        setFlippedIndices([]);
        setMoves(0);
        setIsComplete(false);
    }
    
    useEffect(() => {
        if (flippedIndices.length === 2) {
            const [firstIndex, secondIndex] = flippedIndices;
            const firstCard = board[firstIndex];
            const secondCard = board[secondIndex];

            if (firstCard.icon.key === secondCard.icon.key) {
                const newBoard = [...board];
                newBoard[firstIndex].isMatched = true;
                newBoard[secondIndex].isMatched = true;
                setBoard(newBoard);
                setFlippedIndices([]);
            } else {
                setTimeout(() => {
                    const newBoard = [...board];
                    newBoard[firstIndex].isFlipped = false;
                    newBoard[secondIndex].isFlipped = false;
                    setBoard(newBoard);
                    setFlippedIndices([]);
                }, 1000);
            }
            setMoves(m => m + 1);
        }
    }, [flippedIndices, board]);

    useEffect(() => {
        const allMatched = board.every(card => card.isMatched);
        if (allMatched && moves > 0 && !isComplete) {
            setIsComplete(true);
        }
    }, [board, isComplete, moves]);

    const handleCardClick = (index: number) => {
        if (flippedIndices.length === 2 || board[index].isFlipped || isComplete) return;

        const newBoard = [...board];
        newBoard[index].isFlipped = true;
        setBoard(newBoard);
        setFlippedIndices([...flippedIndices, index]);
    };
    
    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline">Memory Game</CardTitle>
                <CardDescription>Find the matching pairs. Moves: {moves}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4 p-4">
                 <div className="grid grid-cols-4 gap-4">
                    {board.map((card, index) => (
                        <div
                            key={index}
                            onClick={() => handleCardClick(index)}
                            className={cn(
                                "w-20 h-20 rounded-lg flex items-center justify-center cursor-pointer transition-transform duration-300",
                                card.isFlipped || card.isMatched ? "bg-primary/20 text-primary" : "bg-secondary",
                                "transform-style-3d",
                                card.isFlipped || card.isMatched ? "rotate-y-180" : ""
                            )}
                        >
                             <div className={cn("w-10 h-10", card.isFlipped || card.isMatched ? 'block' : 'hidden')}>
                                {card.icon}
                            </div>
                        </div>
                    ))}
                </div>
                {isComplete && (
                    <div className="text-center space-y-2 mt-4">
                        <p className="font-semibold text-lg">You won in {moves} moves!</p>
                        <Button onClick={resetGame}>Play Again</Button>
                    </div>
                )}
                 {!isComplete && <Button onClick={resetGame} variant="outline" className="mt-4">Reset Game</Button>}
            </CardContent>
        </Card>
    );
}

// Add this to globals.css if you want the flip animation
/*
@layer utilities {
    .transform-style-3d {
        transform-style: preserve-3d;
    }
    .rotate-y-180 {
        transform: rotateY(180deg);
    }
}
*/
