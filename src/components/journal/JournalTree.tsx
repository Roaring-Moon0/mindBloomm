'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { updateTreeName } from '@/services/journal-service';
import { Loader2, Edit, Check } from 'lucide-react';
import { getTreeStage } from '@/lib/journal-utils';


interface JournalTreeProps {
    entryCount: number;
    treeName?: string;
}

export function JournalTree({ entryCount, treeName: initialTreeName }: JournalTreeProps) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(initialTreeName || '');
    const [isSaving, setIsSaving] = useState(false);
    
    const { src, alt, stageName } = getTreeStage(entryCount);

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
        <Card className="sticky top-24">
            <CardHeader className="text-center">
                {!isEditingName ? (
                    <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                        {initialTreeName || "My Gratitude Tree"}
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setIsEditingName(true); setNewName(initialTreeName || ''); }}>
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
                    {entryCount} {entryCount === 1 ? 'entry' : 'entries'} | Stage: {stageName}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="relative w-full aspect-square max-w-[300px]">
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain"
                        priority
                    />
                </div>
            </CardContent>
        </Card>
    );
}
