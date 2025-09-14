
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { deleteJournalEntry } from '@/services/journal-service';
import { toast } from '@/hooks/use-toast';
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
} from "@/components/ui/alert-dialog"
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface JournalEntry {
    id: string;
    content: string;
    createdAt: any;
}

export function JournalEntryCard({ entry }: { entry: JournalEntry }) {
    
    const handleDelete = async () => {
        try {
            await deleteJournalEntry(entry.id);
            toast({ title: "Entry Deleted" });
        } catch (error: any) {
             toast({ variant: 'destructive', title: "Error Deleting Entry", description: error.message });
        }
    };
    
    const formattedDate = entry.createdAt?.toDate ? format(entry.createdAt.toDate(), 'MMMM d, yyyy') : 'Date not available';

    return (
        <Card>
            <CardHeader>
                <CardDescription>{formattedDate}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="whitespace-pre-wrap">{entry.content}</p>
            </CardContent>
            <CardFooter className="flex justify-end">
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-4 h-4"/>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your journal entry.
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
            </CardFooter>
        </Card>
    );
}
