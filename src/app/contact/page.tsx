'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { addDoc, collection, doc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Icons } from '@/components/common/icons';

export default function ContactPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You must be logged in to send a message.',
      });
      router.push('/login');
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

    try {
      const conversationsRef = collection(firestore, 'conversations');
      const q = query(conversationsRef, where('userId', '==', user.uid));
      
      const querySnapshot = await getDocs(q);
      let conversationId: string;

      if (querySnapshot.empty) {
        // Create new conversation
        const newConversationRef = doc(conversationsRef);
        conversationId = newConversationRef.id;
        
        await setDoc(newConversationRef, {
          userId: user.uid,
          userEmail: user.email,
          participants: [user.uid],
          lastMessage: message,
          lastMessageAt: serverTimestamp(),
          lastMessageSenderId: user.uid,
          isReadByAdmin: false,
        });

      } else {
        // Use existing conversation
        conversationId = querySnapshot.docs[0].id;
      }
      
      const messagesRef = collection(firestore, 'conversations', conversationId, 'messages');
      await addDoc(messagesRef, {
        senderId: user.uid,
        text: `${subject}: ${message}`,
        timestamp: serverTimestamp(),
      });

      // Update last message on conversation
      await setDoc(doc(firestore, 'conversations', conversationId), {
        lastMessage: message,
        lastMessageAt: serverTimestamp(),
        lastMessageSenderId: user.uid,
        isReadByAdmin: false,
      }, { merge: true });

      toast({
        title: 'Message Sent!',
        description: "We've received your message and will get back to you shortly.",
      });

      router.push(`/contact/chat`);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not send your message. Please try again later.',
      });
      setIsLoading(false);
    }
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
              <Input 
                id="subject" 
                placeholder="Question about an order"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isLoading}
              />
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
    