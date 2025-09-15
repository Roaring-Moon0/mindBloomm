
'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { treeAiChat } from '@/ai/flows/tree-ai-chat';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Loader2 } from 'lucide-react';

interface TreeState {
  name: string;
  health: number;
  mood: string;
}

interface TreeAiChatDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  treeState: TreeState;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function TreeAiChatDialog({ isOpen, onOpenChange, user, treeState }: TreeAiChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          role: 'assistant',
          content: `Hello. I am ${treeState.name}. It is good to feel the sun with you. What is on your mind?`,
        },
      ]);
    } else {
      // Clear messages and input when dialog is closed
      setMessages([]);
      setInput('');
    }
  }, [isOpen, treeState.name]);
  
  useEffect(() => {
    if (scrollAreaViewportRef.current) {
      scrollAreaViewportRef.current.scrollTop = scrollAreaViewportRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInput('');
    setIsLoading(true);

    try {
      const result = await treeAiChat({
        userInput: input,
        treeName: treeState.name,
        treeHealth: treeState.health,
        treeMood: treeState.mood,
        history: messages, // Pass the conversation history
      });

      const assistantMessage: Message = { role: 'assistant', content: result.response };
      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Tree AI Chat Error:', error);
      const errorMessage: Message = { role: 'assistant', content: "My thoughts are rustling like dry leaves... I can't seem to find the right words. Please try again later." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'U';
    const name = user?.displayName;
    if (name) return name.substring(0, 2).toUpperCase();
    return email.substring(0, 2).toUpperCase();
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-lg lg:max-w-2xl grid-rows-[auto,1fr,auto] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Talk to {treeState.name}</DialogTitle>
          <DialogDescription>
            Share your thoughts with your tree. It's always here to listen.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow my-4 pr-6 -mr-6" viewportRef={scrollAreaViewportRef}>
           <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="w-8 h-8 border-2 border-primary/50 bg-green-100 text-lg">
                    <AvatarFallback>🌳</AvatarFallback>
                  </Avatar>
                )}
                <div className={`rounded-lg p-3 max-w-sm text-sm ${message.role === 'user' ? 'bg-primary/20' : 'bg-secondary'}`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && user && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-3">
                 <Avatar className="w-8 h-8 border-2 border-primary/50 bg-green-100 text-lg">
                    <AvatarFallback>🌳</AvatarFallback>
                  </Avatar>
                <div className="rounded-lg p-3 bg-secondary flex items-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p>The tree is gathering its thoughts...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-4 border-t">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share your thoughts..."
            autoComplete="off"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="w-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
