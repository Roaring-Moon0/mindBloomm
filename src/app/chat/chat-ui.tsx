
'use client';

import { useState, useEffect, useRef } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generatePersonalizedRecommendations } from '@/ai/flows/generate-personalized-recommendations';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Sparkles, User, Send } from 'lucide-react';
import Logo from '@/components/icons/Logo';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/use-auth';

const formSchema = z.object({
  userInput: z.string(),
});

type Message = {
  role: 'user' | 'assistant';
  content: string | React.ReactNode;
};

const loadingMessages = [
    "Brewing a fresh cup of calm for you...",
    "Consulting the wise old owl...",
    "Finding the perfect words of wisdom...",
    "Charging up the good vibes...",
    "Waking up the digital zen master...",
    "Just a moment, polishing some peaceful thoughts."
];

// A simple markdown to HTML converter
const formatMarkdown = (text: string) => {
  // Bold
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italics
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Line breaks
  text = text.replace(/\n/g, '<br />');
  return text;
};

const defaultInitialMessage: Message = {
  role: 'assistant',
  content: "Hello! I'm here to help. To give you the best recommendations, could you please tell me a bit about how you're feeling today?",
};


export function ChatUI() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(loadingMessages[0]);
  const scrollViewportRef = useRef<HTMLDivElement>(null);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        userInput: '',
    },
  });

  const getInitials = (email: string | null | undefined) => {
    if (!email) return "U";
    const name = user?.displayName;
    if (name) return name.substring(0, 2).toUpperCase();
    return email.substring(0, 2).toUpperCase();
  }

  // Load messages from localStorage on initial render
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
        try {
            const parsedMessages = JSON.parse(savedMessages).map((msg: Message) => {
                if (msg.role === 'assistant' && typeof msg.content === 'string') {
                    return {
                        ...msg,
                        content: (
                            <div
                                className="space-y-2 whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }}
                            />
                        ),
                    };
                }
                return msg;
            });
            setMessages(parsedMessages);
        } catch (e) {
            setMessages([defaultInitialMessage]);
        }
    } else {
      setMessages([defaultInitialMessage]);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    const messagesToSave = messages.map(msg => {
        // We need to convert ReactNode back to a string for storage
        if (typeof msg.content !== 'string') {
            // This is a simple and imperfect way to get text content.
            // A more robust solution might be needed for complex nodes.
            return { ...msg, content: (msg.content as any)?.props?.dangerouslySetInnerHTML?.__html || '...' };
        }
        return msg;
    });
    localStorage.setItem('chatHistory', JSON.stringify(messagesToSave));
  }, [messages]);


  useEffect(() => {
    const viewport = scrollViewportRef.current;
    if (viewport) {
        // We want to scroll to the bottom on new messages or when loading starts/stops
        viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.userInput.trim()) {
        return;
    }
    setIsLoading(true);
    setLoadingText(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
    
    form.reset();
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
    }
  }

  const showForm = !isLoading && (messages.length === 0 || messages[messages.length - 1].role === 'assistant');

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-6 flex flex-col h-full">
        <ScrollArea className="flex-grow pr-4" viewportRef={scrollViewportRef}>
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
                    {message.role === 'user' && user && (
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'}/>
                        <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
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
                            <p className="text-sm">{loadingText}</p>
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>
        
        {showForm && (
            <div className="mt-6 border-t pt-6 flex-shrink-0">
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
