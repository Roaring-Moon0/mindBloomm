
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addJournalEntry } from '@/services/journal-service';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle } from 'lucide-react';

const formSchema = z.object({
  content: z.string().min(10, { message: "Your entry must be at least 10 characters." }),
});

export function JournalEditor() {
    const { user } = useAuth();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { content: "" },
    });

    const { formState: { isSubmitting } } = form;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to save an entry.' });
            return;
        }

        try {
            await addJournalEntry(user.uid, values.content);
            toast({ title: "Entry Saved", description: "Your tree has grown a little today!" });
            form.reset();
        } catch (error: any) {
            toast({ variant: 'destructive', title: "Error Saving Entry", description: error.message });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>New Journal Entry</CardTitle>
                <CardDescription>What are you grateful for today?</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="sr-only">Journal Entry</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Today, I'm thankful for..."
                                            className="min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting || !user}>
                            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</> : <><PlusCircle className="mr-2 h-4 w-4"/> Save Entry</>}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
