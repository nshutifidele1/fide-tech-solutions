'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { addDoc, collection, doc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Icons } from '@/components/common/icons';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ContactPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You must be logged in to send a message.',
      });
      if (!user) router.push('/login');
      return;
    }

    if (!subject.trim() || !message.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill out both subject and message.',
      });
      return;
    }

    setIsLoading(true);

    const conversationsRef = collection(firestore, 'conversations');
    const q = query(conversationsRef, where('userId', '==', user.uid));

    // Non-blocking: process the query and then navigate.
    getDocs(q)
      .then((querySnapshot) => {
        let conversationId: string;
        const fullMessage = `${subject}: ${message}`;

        if (querySnapshot.empty) {
          // Create a new conversation
          const newConversationRef = doc(conversationsRef);
          conversationId = newConversationRef.id;
          const conversationData = {
            userId: user.uid,
            userEmail: user.email,
            participants: [user.uid],
            lastMessage: fullMessage,
            lastMessageAt: serverTimestamp(),
            lastMessageSenderId: user.uid,
            isReadByAdmin: false,
          };
          setDoc(newConversationRef, conversationData).catch((error) => {
            const contextualError = new FirestorePermissionError({
              path: newConversationRef.path,
              operation: 'create',
              requestResourceData: conversationData,
            });
            errorEmitter.emit('permission-error', contextualError);
          });
        } else {
          // Use existing conversation and update it
          conversationId = querySnapshot.docs[0].id;
          const conversationUpdateData = {
            lastMessage: fullMessage,
            lastMessageAt: serverTimestamp(),
            lastMessageSenderId: user.uid,
            isReadByAdmin: false,
          };
          setDoc(doc(firestore, 'conversations', conversationId), conversationUpdateData, { merge: true }).catch((error) => {
            const contextualError = new FirestorePermissionError({
              path: `conversations/${conversationId}`,
              operation: 'update',
              requestResourceData: conversationUpdateData,
            });
            errorEmitter.emit('permission-error', contextualError);
          });
        }

        // Add the new message to the conversation
        const messagesRef = collection(firestore, 'conversations', conversationId, 'messages');
        const messageData = {
          senderId: user.uid,
          text: fullMessage,
          timestamp: serverTimestamp(),
        };
        addDoc(messagesRef, messageData).catch((error) => {
          const contextualError = new FirestorePermissionError({
            path: messagesRef.path,
            operation: 'create',
            requestResourceData: messageData,
          });
          errorEmitter.emit('permission-error', contextualError);
        });
      })
      .catch((error) => {
        const contextualError = new FirestorePermissionError({
          path: 'conversations',
          operation: 'list',
        });
        errorEmitter.emit('permission-error', contextualError);
        // Do not set isLoading to false here, as we are navigating away.
      });

    // Optimistic UI: Navigate immediately
    toast({
      title: 'Message Sent!',
      description: "We've received your message and will get back to you shortly.",
    });
    router.push(`/contact/chat`);
  };

  return (
    <div className="container py-16 sm:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Contact Us
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Have a question or need support? Send us a message below.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="font-headline text-2xl font-bold text-foreground">Send a Message</h2>
          <p className="mt-2 text-muted-foreground">
            Our team will get back to you as soon as possible.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select onValueChange={setSubject} value={subject} disabled={isLoading}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Computer">Computer</SelectItem>
                  <SelectItem value="Own Problems">Own Problems</SelectItem>
                  <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                  <SelectItem value="Order Support">Order Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                placeholder="Your message..." 
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" size="lg" disabled={isLoading || isUserLoading}>
              {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : 'Send Message'}
            </Button>
            {user && (
              <Button variant="outline" asChild className="ml-4">
                <a href="/contact/chat">View My Messages</a>
              </Button>
            )}
          </form>
        </div>
        
        <div className="space-y-8">
           <h2 className="font-headline text-2xl font-bold text-foreground">Contact Information</h2>
           <div className="space-y-6">
             <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Email</h3>
                <p className="text-muted-foreground">General Inquiries: <a href="mailto:contact@setso.com" className="text-primary hover:underline">contact@setso.com</a></p>
                <p className="text-muted-foreground">Support: <a href="mailto:support@setso.com" className="text-primary hover:underline">support@setso.com</a></p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Phone</h3>
                <p className="text-muted-foreground">Sales: (123) 456-7890</p>
                <p className="text-muted-foreground">Support: (123) 456-7891</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Office</h3>
                <p className="text-muted-foreground">123 Tech Avenue, Silicon Valley, CA 94000</p>
                <p className="text-muted-foreground">Mon - Fri, 9am - 5pm PST</p>
              </div>
            </div>
           </div>
        </div>
      </div>
    </div>
  );
}
