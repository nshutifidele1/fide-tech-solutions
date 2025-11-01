import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Contact Us - Setso',
  description: 'Get in touch with Setso for support, sales, or any inquiries.',
};

export default function ContactPage() {
  return (
    <div className="container py-16 sm:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Contact Us
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Have a question or need support? We're here to help.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="font-headline text-2xl font-bold text-foreground">Get in Touch</h2>
          <p className="mt-2 text-muted-foreground">
            Fill out the form and our team will get back to you within 24 hours.
          </p>
          <form className="mt-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your Name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Your Email" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Question about an order" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Your message..." rows={5} />
            </div>
            <Button type="submit" size="lg">Send Message</Button>
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
