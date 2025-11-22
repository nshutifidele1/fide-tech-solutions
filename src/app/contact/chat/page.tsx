'use client';

import { useMemo, useEffect, useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import ChatInterface from '@/components/chat/ChatInterface';
import { useRouter } from 'next/navigation';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

export default function UserChatPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isUserLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const findConversation = async () => {
      if (!firestore) return;
      try {
        const conversationsRef = collection(firestore, 'conversations');
        const q = query(conversationsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setConversationId(querySnapshot.docs[0].id);
        }
      } catch (error) {
        const contextualError = new FirestorePermissionError({
            path: 'conversations',
            operation: 'list'
        });
        errorEmitter.emit('permission-error', contextualError);
        console.error("Error finding conversation:", error);
      } finally {
        setIsLoading(false);
      }
    };

    findConversation();
  }, [user, isUserLoading, firestore, router]);


  if (isLoading || isUserLoading) {
    return <div className="container py-12 text-center">Loading your messages...</div>;
  }

  return (
    <div className="container py-8">
      <h1 className="font-headline text-3xl font-bold tracking-tight text-center md:text-4xl mb-8">
        Your Conversation with Support
      </h1>
      {conversationId ? (
        <div className="max-w-4xl mx-auto border rounded-lg">
           <ChatInterface conversationId={conversationId} />
        </div>
      ) : (
        <div className="text-center">
          <p>You have no active conversations. Start one from the <a href="/contact" className="underline text-primary">contact page</a>.</p>
        </div>
      )}
    </div>
  );
}