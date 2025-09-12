'use client';

import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generatePersonalizedRecommendations } from '@/ai/flows/generate-personalized-recommendations';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Send, ArrowDown } from 'lucide-react';
import Logo from '@/components/icons/Logo';
import { useAuth } from '@/hooks/use-auth';

const formSchema = z.object({
  userInput: z.string(),
});

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const loadingMessages = [
  'Brewing a fresh cup of calm for you...',
  'Consulting the wise old owl...',
  'Finding the perfect words of wisdom...',
  'Charging up the good vibes...',
  'Waking up the digital zen master...',
  'Just a moment, polishing some peaceful thoughts.',
];

const formatMarkdown = (text: string) => {
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  text = text.replace(/\n/g, '<br />');
  return text;
};

const defaultInitialMessage: Message = {
  role: 'assistant',
  content:
    "Hello! I'm here to help. To give you the best recommendations, could you please tell me a bit about how you're feeling today?",
};

export function ChatUI() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(loadingMessages[0]);

  // scroll refs & state
  const scrollRef = useRef<HTMLDivElement | null>(null); // the scrollable container
  const bottomRef = useRef<HTMLDivElement | null>(null); // dummy at end of messages
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const lastSeenRef = useRef<number>(0); // index of last seen message

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userInput: '',
    },
  });

  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'U';
    const name = user?.displayName;
    if (name) return name.substring(0, 2).toUpperCase();
    return email.substring(0, 2).toUpperCase();
  };

  // Load messages from localStorage (or default)
  useEffect(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Message[];
        setMessages(parsed);
        lastSeenRef.current = parsed.length;
      } catch {
        setMessages([defaultInitialMessage]);
        lastSeenRef.current = 1;
      }
    } else {
      setMessages([defaultInitialMessage]);
      lastSeenRef.current = 1;
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  // Scroll listener -> determine if user scrolled up
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      // threshold in px to consider "at bottom"
      const threshold = 80;
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
      setIsAtBottom(atBottom);
      if (atBottom) {
        lastSeenRef.current = messages.length;
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    // call once to initialize
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  // Auto-scroll when new messages arrive ONLY if user is at bottom
  useEffect(() => {
    // if user is at bottom -> scroll to bottom
    if (isAtBottom) {
      // scroll using the bottom ref (smooth after first load)
      bottomRef.current?.scrollIntoView({
        behavior: isFirstLoad ? 'auto' : 'smooth',
        block: 'nearest',
      });
      lastSeenRef.current = messages.length;
    }
    if (isFirstLoad) setIsFirstLoad(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isLoading]);

  // helper to force-scroll to bottom (used by button and after sending)
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    // prefer scrolling the container itself if available (more reliable)
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior });
    } else {
      bottomRef.current?.scrollIntoView({ behavior, block: 'nearest' });
    }
    setIsAtBottom(true);
    lastSeenRef.current = messages.length;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.userInput.trim()) return;

    setIsLoading(true);
    setLoadingText(
      loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
    );
    form.reset();

    const userMessage: Message = { role: 'user', content: values.userInput };
    setMessages((prev) => {
      const next = [...prev, userMessage];
      return next;
    });

    // if user was at bottom when sending, keep them at bottom
    if (isAtBottom) {
      // wait a tick then scroll to bottom so new message is visible
      requestAnimationFrame(() => scrollToBottom('smooth'));
    }

    try {
      const result = await generatePersonalizedRecommendations({
        userInput: values.userInput,
      });
      const assistantMessage: Message = {
        role: 'assistant',
        content: result.recommendations,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      // after assistant message, scroll if user was at bottom
      if (isAtBottom) requestAnimationFrame(() => scrollToBottom('smooth'));
    } catch (error: any) {
      let errorMessage = 'Sorry, I encountered an error. Please try again later.';
      if (error?.message?.includes?.('503')) {
        errorMessage = "I'm experiencing high demand right now. Please wait a moment and try again.";
      }
      const assistantMessage: Message = { role: 'assistant', content: errorMessage };
      setMessages((prev) => [...prev, assistantMessage]);
      if (isAtBottom) requestAnimationFrame(() => scrollToBottom('smooth'));
    } finally {
      setIsLoading(false);
    }
  }

  // whether to show the "new messages" button:
  const showNewMessagesButton = !isAtBottom && messages.length > lastSeenRef.current;

  return (
    <div className="relative flex flex-col w-full max-w-3xl mx-auto p-4 md:p-6 h-full">
      {/* Scrollable message area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto min-h-0 pr-4 -mr-4"
        aria-live="polite"
      >
        <div className="space-y-6 pb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}
            >
              {message.role === 'assistant' && (
                <Avatar className="w-8 h-8 border-2 border-primary/50">
                  <AvatarFallback>
                    <Logo className="w-5 h-5 text-primary" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div className={`rounded-lg p-3 max-w-lg text-sm ${message.role === 'user' ? 'bg-primary/20' : 'bg-secondary'}`}>
                <div dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }} />
              </div>
              {message.role === 'user' && user && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                  <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-4">
              <Avatar className="w-8 h-8 border-2 border-primary/50">
                <AvatarFallback>
                  <Logo className="w-5 h-5 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="rounded-lg p-3 bg-secondary flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p>{loadingText}</p>
              </div>
            </div>
          )}

          {/* bottom anchor (inside scroll area) */}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* floating "New messages" button */}
      {showNewMessagesButton && (
        <div className="absolute right-10 bottom-28 z-40">
          <Button
            onClick={() => scrollToBottom('smooth')}
            title="Scroll to latest"
            className="flex items-center gap-2 rounded-full h-10"
          >
            <ArrowDown className="w-4 h-4" />
            <span className="text-sm">New messages</span>
          </Button>
        </div>
      )}

      {/* Input area (outside the scroll container so it stays visible) */}
      <div className="mt-4 pt-4 border-t flex-shrink-0 bg-background">
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
                        disabled={isLoading || !field.value.trim()}
                      >
                        <Send className="w-5 h-5" />
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
    </div>
  );
}
