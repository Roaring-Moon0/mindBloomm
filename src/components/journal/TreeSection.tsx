
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { updateTreeName } from '@/services/journal-service';
import { Loader2, Edit, Check } from 'lucide-react';
import { getTreeStage, type Journal } from '@/lib/journal-utils';
import { motion } from 'framer-motion';


interface TreeSectionProps {
    journal: Journal | null;
}

const CodeTree = ({ health }: { health: number }) => {
  const leavesCount = Math.max(0, Math.floor(health / 10));

  // Base trunk color on health
  const trunkColor = health < 40 ? '#8B4513' : '#654321';
  // Base leaf color on health
  const leafColor = `hsl(${80 + health * 0.4}, 60%, ${30 + health * 0.2}%)`;

  return (
    <motion.svg 
      viewBox="0 0 200 200" 
      className="w-full h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Trunk and branches */}
      <path 
        d="M100 200 V100 M100 140 L70 110 M100 120 L130 90 M70 110 L50 90 M130 90 L150 70" 
        stroke={trunkColor} 
        strokeWidth="10" 
        strokeLinecap="round" 
      />

      {/* Leaves */}
      {Array.from({ length: leavesCount }).map((_, i) => {
        // Distribute leaves around branches
        const positions = [
          { cx: 70, cy: 100 }, { cx: 130, cy: 80 }, { cx: 50, cy: 80 },
          { cx: 150, cy: 60 }, { cx: 90, cy: 90 }, { cx: 110, cy: 70 },
          { cx: 60, cy: 120 }, { cx: 140, cy: 100 }, { cx: 80, cy: 70 }, { cx: 120, cy: 60 }
        ];
        const pos = positions[i % positions.length];
        const randomX = (Math.random() - 0.5) * 20;
        const randomY = (Math.random() - 0.5) * 20;
        
        return (
           <motion.circle 
                key={i}
                cx={pos.cx + randomX} 
                cy={pos.cy + randomY} 
                r="8" 
                fill={leafColor}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
           />
        )
      })}
    </motion.svg>
  );
};


export function TreeSection({ journal }: TreeSectionProps) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(journal?.treeName || '');
    const [isSaving, setIsSaving] = useState(false);
    
    const treeHealth = journal?.treeHealth ?? 80;
    const initialTreeName = journal?.treeName || "My Tree";
    
    const { stageName } = getTreeStage(treeHealth);

    const handleSaveName = async () => {
        if (!newName.trim()) {
            toast({ variant: 'destructive', title: 'Name cannot be empty.' });
            return;
        }
        setIsSaving(true);
        try {
            await updateTreeName({ name: newName });
            toast({ title: 'Tree name updated!' });
            setIsEditingName(false);
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error saving name', description: error.message });
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
        <Card className="sticky top-24 shadow-lg border-primary/10">
            <CardHeader className="text-center">
                {!isEditingName ? (
                    <CardTitle className="flex items-center justify-center gap-2 text-2xl font-headline">
                        {initialTreeName}
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setIsEditingName(true); setNewName(initialTreeName); }}>
                            <Edit className="h-4 w-4" />
                        </Button>
                    </CardTitle>
                ) : (
                    <div className="flex items-center gap-2">
                        <Input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Give your tree a name"
                            disabled={isSaving}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                        />
                         <Button size="icon" onClick={handleSaveName} disabled={isSaving} className="h-9 w-9">
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin"/> : <Check className="h-4 w-4"/>}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setIsEditingName(false)} disabled={isSaving} className="h-9 w-9">
                           <Edit className="h-4 w-4"/>
                        </Button>
                    </div>
                )}
                 <CardDescription>
                    Health: {Math.round(treeHealth)}% | Stage: {stageName} | Mood: {journal?.mood || 'happy'} {journal?.emoji || '😊'}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="relative w-full aspect-square max-w-[300px]">
                    <CodeTree health={treeHealth} />
                </div>
            </CardContent>
        </Card>
    );
}
