'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, addDoc, serverTimestamp, query, orderBy, doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ChatInterfaceProps {
  conversationId: string;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: { seconds: number; nanoseconds: number } | null;
}

export default function ChatInterface({ conversationId }: ChatInterfaceProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const messagesQuery = useMemo(() => {
    if (!firestore || !conversationId) return null;
    return query(
      collection(firestore, 'conversations', conversationId, 'messages'),
      orderBy('timestamp', 'asc')
    );
  }, [firestore, conversationId]);

  const { data: messages, isLoading } = useCollection<Omit<Message, 'id'>>(messagesQuery);

  useEffect(() => {
    if (scrollAreaRef.current) {
        // A slight delay to ensure the DOM has updated with the new message
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
            if(viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }, 100);
    }
  }, [messages]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !firestore) return;

    const messagesRef = collection(firestore, 'conversations', conversationId, 'messages');
    await addDoc(messagesRef, {
      senderId: user.uid,
      text: newMessage,
      timestamp: serverTimestamp(),
    });

    const conversationRef = doc(firestore, 'conversations', conversationId);
    await setDoc(conversationRef, {
        lastMessage: newMessage,
        lastMessageAt: serverTimestamp(),
        lastMessageSenderId: user.uid,
        isReadByAdmin: false,
    }, { merge: true });

    setNewMessage('');
  };
  
  const getInitials = (id: string | null | undefined) => {
    if (!id) return 'S'; // Support
    return user?.uid === id ? 'Y' : 'S';
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] md:h-auto md:max-h-[calc(100vh-8rem)]">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {isLoading && <div>Loading messages...</div>}
          {messages && messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex items-end gap-2",
                msg.senderId === user?.uid ? "justify-end" : "justify-start"
              )}
            >
              {msg.senderId !== user?.uid && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getInitials(msg.senderId)}</AvatarFallback>
                </Avatar>
              )}
              <div className="max-w-xs md:max-w-md lg:max-w-lg">
                <div
                  className={cn(
                    "rounded-lg px-4 py-2",
                    msg.senderId === user?.uid
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
                 <p className={cn("text-xs text-muted-foreground mt-1", msg.senderId === user?.uid ? "text-right" : "text-left")}>
                    {msg.timestamp ? format(new Date(msg.timestamp.seconds * 1000), 'p') : ''}
                </p>
              </div>

               {msg.senderId === user?.uid && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getInitials(msg.senderId)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            autoComplete="off"
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
    