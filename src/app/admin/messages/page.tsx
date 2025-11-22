'use client';

import { useMemo, useState } from 'react';
import { collection, query, orderBy, where, doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { useUserRole } from '@/hooks/use-user-role';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import ChatInterface from '@/components/chat/ChatInterface';

interface Conversation {
  id: string;
  userId: string;
  userEmail: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: { seconds: number; nanoseconds: number } | null;
  lastMessageSenderId: string;
  isReadByAdmin: boolean;
}

export default function AdminMessagesPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { isAdmin, isLoading } = useUserRole();
  const router = useRouter();

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const conversationsQuery = useMemoFirebase(() => {
    if (!firestore || !isAdmin) return null;
    return query(collection(firestore, 'conversations'), orderBy('lastMessageAt', 'desc'));
  }, [firestore, isAdmin]);

  const { data: conversations, isLoading: conversationsLoading } = useCollection<Conversation>(conversationsQuery);
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><p>Loading...</p></div>;
  }
  
  if (!isAdmin) {
    router.push('/login');
    return null;
  }

  const handleSelectConversation = async (conversationId: string) => {
    if (!firestore || !user) return;
    setSelectedConversationId(conversationId);
    const convRef = doc(firestore, 'conversations', conversationId);
    
    const selectedConversation = conversations?.find(c => c.id === conversationId);
    if (selectedConversation && !selectedConversation.participants.includes(user.uid)) {
       await updateDoc(convRef, {
        participants: [...selectedConversation.participants, user.uid]
      });
    }

    await setDoc(convRef, { isReadByAdmin: true }, { merge: true });
  };

  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 h-full max-h-[calc(100vh-4rem)]">
      <div className="col-span-1 border-r bg-background">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Conversations</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-8.5rem)]">
          {conversationsLoading && <div className="p-4 text-muted-foreground">Loading conversations...</div>}
          {!conversationsLoading && conversations && conversations.map((conv) => (
            <div
              key={conv.id}
              className={cn(
                "p-4 border-b cursor-pointer hover:bg-accent",
                selectedConversationId === conv.id && "bg-accent"
              )}
              onClick={() => handleSelectConversation(conv.id)}
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{getInitials(conv.userEmail)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 truncate">
                  <div className="flex justify-between items-center">
                    <p className={cn("font-semibold truncate", !conv.isReadByAdmin && "font-bold text-primary")}>{conv.userEmail}</p>
                    <p className="text-xs text-muted-foreground">
                      {conv.lastMessageAt ? formatDistanceToNow(new Date(conv.lastMessageAt.seconds * 1000), { addSuffix: true }) : ''}
                    </p>
                  </div>
                  <p className={cn("text-sm text-muted-foreground truncate", !conv.isReadByAdmin && "text-foreground font-semibold")}>
                    {conv.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
           {!conversationsLoading && conversations?.length === 0 && <div className="p-4 text-center text-muted-foreground">No conversations yet.</div>}
        </ScrollArea>
      </div>
      <div className="col-span-1 md:col-span-2 xl:col-span-3">
        {selectedConversationId ? (
          <ChatInterface conversationId={selectedConversationId} />
        ) : (
          <div className="flex items-center justify-center h-full bg-muted/40">
            <p className="text-muted-foreground">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
