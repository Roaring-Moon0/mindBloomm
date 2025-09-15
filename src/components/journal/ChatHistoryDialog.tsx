'use client';

import React, { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { useFirestoreCollection } from '@/hooks/use-firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, MessageCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Chat {
  id: string;
  title: string;
  createdAt: any;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: any;
}

interface ChatHistoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

function ChatMessages({ chatId, user }: { chatId: string, user: User }) {
  const { data: messages, loading, error } = useFirestoreCollection<Message>(`users/${user?.uid}/chats/${chatId}/messages`);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive text-center">Error loading messages.</div>
  }
  
  if (!messages || messages.length === 0) {
      return <div className="text-center text-muted-foreground py-10">No messages in this chat yet.</div>
  }
  
  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'U';
    const name = user?.displayName;
    if (name) return name.substring(0, 2).toUpperCase();
    return email.substring(0, 2).toUpperCase();
  };


  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 pr-4">
        {messages.map((message) => (
          <div key={message.id} className={cn("flex items-start gap-3", message.sender === 'user' ? 'justify-end' : '')}>
            {message.sender === 'assistant' && (
               <Avatar className="w-8 h-8 border-2 border-primary/50 bg-green-100 text-lg">
                <AvatarFallback>🌳</AvatarFallback>
              </Avatar>
            )}
            <div className={cn("rounded-lg p-3 max-w-sm text-sm", message.sender === 'user' ? 'bg-primary/20' : 'bg-secondary')}>
              <p className="whitespace-pre-wrap">{message.text}</p>
              <p className="text-xs text-muted-foreground mt-1 text-right">{message.timestamp ? format(message.timestamp.toDate(), 'p') : ''}</p>
            </div>
             {message.sender === 'user' && user && (
              <Avatar className="w-8 h-8">
                <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}


export function ChatHistoryDialog({ isOpen, onOpenChange, user }: ChatHistoryDialogProps) {
  const { data: chats, loading, error } = useFirestoreCollection<Chat>(`users/${user?.uid}/chats`);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  // When chats load, select the first one by default
  useEffect(() => {
    if (chats && chats.length > 0 && !selectedChatId) {
      setSelectedChatId(chats[0].id);
    }
  }, [chats, selectedChatId]);

  // Reset selected chat when dialog is closed
  useEffect(() => {
    if (!isOpen) {
        setSelectedChatId(null);
    }
  }, [isOpen]);

  // When chats data changes, select the first chat if none is selected
  useEffect(() => {
    if(chats && chats.length > 0 && !selectedChatId) {
        setSelectedChatId(chats[0].id)
    }
  }, [chats, selectedChatId])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[70vh] grid grid-rows-[auto,1fr]">
        <DialogHeader>
          <DialogTitle>Chat History</DialogTitle>
          <DialogDescription>Review your past conversations with your tree.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-6 overflow-hidden h-full">
          {/* Chat List */}
          <div className="col-span-1 border-r pr-4">
            <ScrollArea className="h-full">
              {loading && <div className="text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto"/></div>}
              {error && <div className="text-destructive text-center flex flex-col items-center gap-2"><AlertTriangle/> Error loading chats.</div>}
              {chats && chats.length === 0 && !loading && (
                <div className="text-center text-muted-foreground p-4">
                    <MessageCircle className="mx-auto w-10 h-10 mb-2"/>
                    No chats found.
                </div>
              )}
              <div className="space-y-2">
                {chats?.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChatId(chat.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-md transition-colors",
                      selectedChatId === chat.id ? 'bg-primary/20 font-semibold' : 'hover:bg-secondary'
                    )}
                  >
                    <p>{chat.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {chat.createdAt ? format(chat.createdAt.toDate(), 'MMMM d, yyyy') : ''}
                    </p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
          {/* Messages View */}
          <div className="col-span-2 overflow-y-auto">
            {selectedChatId ? <ChatMessages chatId={selectedChatId} user={user} /> : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>Select a chat to view messages.</p>
                </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
