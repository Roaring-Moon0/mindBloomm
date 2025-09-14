'use client';

import { Card, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { deleteNote } from '@/services/journal-service';
import { toast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import type { Note } from '@/lib/journal-utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';

export function NoteCard({ note }: { note: Note }) {
    
    const handleDelete = async () => {
        try {
            await deleteNote(note.id);
            toast({ title: "Note Deleted" });
        } catch (error: any) {
             toast({ variant: 'destructive', title: "Error Deleting Note", description: error.message });
        }
    };
    
    const formattedDate = note.createdAt?.toDate ? format(note.createdAt.toDate(), 'MMM d, yyyy') : '...';
    const isBad = note.type === 'bad';

    return (
        <Card className={cn(isBad ? 'bg-destructive/5' : 'bg-secondary/5', 'relative group')}>
            {isBad && <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent animate-pulse animation-delay-300 opacity-20 pointer-events-none"/>}
            <CardContent className="p-4 space-y-2">
                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                 <div className="flex justify-between items-center">
                    <CardDescription>{formattedDate}</CardDescription>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="w-4 h-4"/>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this note.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                                Delete
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    );
}
