'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { updateTreeName } from '@/services/journal-service';
import { Loader2, Edit, Check, X } from 'lucide-react';
import { getTreeStage, getTreeAge, type Journal } from '@/lib/journal-utils';

interface TreeSectionProps {
    journal: Journal | null;
}

export function TreeSection({ journal }: TreeSectionProps) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(journal?.treeName || '');
    const [isSaving, setIsSaving] = useState(false);

    const { src, alt } = getTreeStage(journal?.treeHealth || 0);
    const treeAge = getTreeAge(journal?.createdAt);
    const treeHealth = journal?.treeHealth || 0;
    const treeMood = journal?.mood || 'happy';
    const treeEmoji = journal?.emoji || '😊';

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
        <Card className="sticky top-24 shadow-lg border-primary/20">
            <CardHeader className="text-center">
                {!isEditingName ? (
                    <div className="flex items-center justify-center gap-2">
                        <CardTitle className="text-3xl font-headline">
                            {journal?.treeName || "My Tree"}
                        </CardTitle>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setIsEditingName(true); setNewName(journal?.treeName || ''); }}>
                            <Edit className="h-5 w-5" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Give your tree a name"
                            disabled={isSaving}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                        />
                         <Button size="icon" onClick={handleSaveName} disabled={isSaving}>
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin"/> : <Check className="h-4 w-4"/>}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setIsEditingName(false)} disabled={isSaving}>
                           <X className="h-4 w-4"/>
                        </Button>
                    </div>
                )}
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6 gap-6">
                <div className="relative w-full aspect-square max-w-[400px]">
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain"
                        priority
                    />
                </div>
                <div className="w-full space-y-4">
                     <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-muted-foreground">Tree Health</span>
                            <span className="text-lg font-bold">{treeEmoji}</span>
                        </div>
                        <Progress value={treeHealth} className="h-4" />
                    </div>
                     <div>
                        <p className="text-sm font-medium text-muted-foreground">Tree Age</p>
                        <p className="font-semibold text-lg">{treeAge}</p>
                    </div>
                </div>
            </CardContent>
             <CardFooter className="text-center text-xs text-muted-foreground justify-center">
                <p>Keep journaling to watch your tree grow and stay healthy.</p>
            </CardFooter>
        </Card>
    );
}
