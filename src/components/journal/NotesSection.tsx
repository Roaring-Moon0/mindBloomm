'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Flame, Leaf, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addNote } from '@/services/journal-service';
import { toast } from '@/hooks/use-toast';
import type { Note } from '@/lib/journal-utils';
import { NoteCard } from './NoteCard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NotesSectionProps {
  title: string;
  notes: Note[];
  type: 'good' | 'bad';
}

const noteFormSchema = z.object({
  content: z.string().min(10, { message: "Note must be at least 10 characters." }),
});

export function NotesSection({ title, notes, type }: NotesSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const form = useForm<z.infer<typeof noteFormSchema>>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: { content: "" },
  });
  const { formState: { isSubmitting } } = form;

  const Icon = type === 'bad' ? Flame : Leaf;
  const cardColorClass = type === 'bad' ? 'border-destructive/30' : 'border-green-500/30';
  const buttonColorClass = type === 'bad' ? 'bg-destructive hover:bg-destructive/90' : 'bg-green-600 hover:bg-green-700';

  const onSubmit = async (values: z.infer<typeof noteFormSchema>) => {
    try {
      await addNote({ ...values, type });
      toast({ title: "Note added!", description: "Your tree feels it." });
      form.reset();
      setIsAdding(false);
    } catch (error: any) {
      toast({ variant: 'destructive', title: "Error saving note", description: error.message });
    }
  };

  return (
    <Card className={`shadow-md ${cardColorClass}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={type === 'bad' ? 'text-destructive' : 'text-green-500'} />
          <CardTitle>{title}</CardTitle>
        </div>
        <Button size="sm" variant="ghost" onClick={() => setIsAdding(!isAdding)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <Textarea
              placeholder={type === 'bad' ? "What's weighing on you?" : "What went well today?"}
              {...form.register('content')}
              className="min-h-[100px]"
            />
            {form.formState.errors.content && <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button type="submit" size="sm" className={buttonColorClass} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                Save
              </Button>
            </div>
          </form>
        )}
        <ScrollArea className="h-72 pr-4">
          <div className="space-y-4">
            {notes.length > 0 ? (
              notes.map(note => <NoteCard key={note.id} note={note} />)
            ) : (
              <div className="text-center text-muted-foreground py-10">
                <p>No {type} notes yet.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
