'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generatePersonalizedRecommendations } from '@/ai/flows/generate-personalized-recommendations';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Sparkles, User, Send } from 'lucide-react';
import Logo from '@/components/icons/Logo';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  userInput: z.string(),
});

type Message = {
  role: 'user' | 'assistant';
  content: string | React.ReactNode;
};

// A simple markdown to HTML converter
const formatMarkdown = (text: string) => {
  // Bold
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italics
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  return text;
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
        userInput: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.userInput.trim()) {
        return;
    }
    setIsLoading(true);
    
    setMessages((prev) => [...prev, { role: 'user', content: values.userInput }]);

    try {
      const result = await generatePersonalizedRecommendations({ userInput: values.userInput });
      const formattedRecommendations = (
        <div 
          className="space-y-2 whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: formatMarkdown(result.recommendations) }}
        />
      );
      setMessages((prev) => [...prev, { role: 'assistant', content: formattedRecommendations }]);
    } catch (error: any) {
      console.error(error);
      let errorMessage = 'Sorry, I encountered an error. Please try again later.';
      if (error.message && error.message.includes('503')) {
        errorMessage = "I'm experiencing high demand right now. Please wait a moment and try your message again."
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: errorMessage }]);
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
                    <div className={`rounded-lg p-3 max-w-lg ${message.role === 'user' ? 'bg-primary/20' : 'bg-secondary'}`}>
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
                        <FormField
                            control={form.control}
                            name="userInput"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">Your message</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Textarea 
                                            placeholder="Tell me what's on your mind..." 
                                            className="min-h-[80px] pr-20" 
                                            {...field} 
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    form.handleSubmit(onSubmit)();
                                                }
                                            }}
                                        />
                                        <Button 
                                            type="submit" 
                                            size="icon" 
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2" 
                                            disabled={isLoading || !field.value}
                                        >
                                            <Send className="w-5 h-5"/>
                                            <span className="sr-only">Send message</span>
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </div>
        )}
    </div>
  );
}
