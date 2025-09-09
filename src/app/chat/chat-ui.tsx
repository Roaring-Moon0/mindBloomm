'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generatePersonalizedRecommendations } from '@/ai/flows/generate-personalized-recommendations';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Sparkles, User } from 'lucide-react';
import Logo from '@/components/icons/Logo';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  mood: z.string().min(3, { message: 'Please describe your current mood.' }),
  preferences: z.string().min(3, { message: 'Tell us what you enjoy (e.g., meditation, walking, music).' }),
  trackedData: z.string().min(3, { message: 'Describe your recent sleep, activity, or feelings.' }),
});

type Message = {
  role: 'user' | 'assistant';
  content: string | React.ReactNode;
};

export function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm here to help. To give you the best recommendations, could you please tell me a bit about how you're feeling today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mood: '',
      preferences: '',
      trackedData: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const userMessageContent = (
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">Mood:</span> {values.mood}</p>
        <p><span className="font-semibold">Preferences:</span> {values.preferences}</p>
        <p><span className="font-semibold">Recent Activity:</span> {values.trackedData}</p>
      </div>
    );
    
    setMessages((prev) => [...prev, { role: 'user', content: userMessageContent }]);

    try {
      const result = await generatePersonalizedRecommendations(values);
      const recommendations = result.recommendations.split('\n').filter(rec => rec.trim() !== '');
      const formattedRecommendations = (
        <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary"/>Here are a few personalized suggestions for you:</h4>
            <ul className="list-disc list-inside space-y-1">
                {recommendations.map((rec, index) => <li key={index}>{rec.replace(/^- /, '')}</li>)}
            </ul>
        </div>
      );
      setMessages((prev) => [...prev, { role: 'assistant', content: formattedRecommendations }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setIsLoading(false);
      form.reset();
    }
  }

  const showForm = !isLoading && (messages.length === 0 || messages[messages.length - 1].role === 'assistant');

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-6 flex flex-col h-full">
        <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6">
                {messages.map((message, index) => (
                <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    {message.role === 'assistant' && (
                    <Avatar className="w-8 h-8 border-2 border-primary/50">
                        <AvatarFallback><Logo className="w-5 h-5 text-primary"/></AvatarFallback>
                    </Avatar>
                    )}
                    <div className={`rounded-lg p-3 max-w-md ${message.role === 'user' ? 'bg-primary/20' : 'bg-secondary'}`}>
                        <div className="text-sm">{message.content}</div>
                    </div>
                    {message.role === 'user' && (
                    <Avatar className="w-8 h-8">
                        <AvatarFallback><User className="w-5 h-5"/></AvatarFallback>
                    </Avatar>
                    )}
                </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-4">
                        <Avatar className="w-8 h-8 border-2 border-primary/50">
                            <AvatarFallback><Logo className="w-5 h-5 text-primary"/></AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg p-3 bg-secondary flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin"/>
                            <p className="text-sm">Generating recommendations...</p>
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>
        
        {showForm && (
            <div className="mt-6 border-t pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="mood"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>How are you feeling?</FormLabel>
                                    <FormControl>
                                    <Input placeholder="e.g., a bit anxious" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="preferences"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>What helps you relax?</FormLabel>
                                    <FormControl>
                                    <Input placeholder="e.g., music, walking" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="trackedData"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Any recent patterns you've noticed?</FormLabel>
                                <FormControl>
                                <Textarea placeholder="e.g., I haven't been sleeping well..." {...field} rows={2} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading}>
                            Get Recommendations
                        </Button>
                    </form>
                </Form>
            </div>
        )}
    </div>
  );
}
