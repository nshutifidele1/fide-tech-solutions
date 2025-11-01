'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/common/icons';
import { useAuth } from '@/firebase';
import { initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { onAuthStateChanged } from 'firebase/auth';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";


interface SignUpFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const signUpSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
});

type FormData = z.infer<typeof signUpSchema>;

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
     defaultValues: {
        email: '',
        password: '',
    }
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const auth = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      if (!auth) {
        throw new Error('Firebase Auth not initialized');
      }
      initiateEmailSignUp(auth, data.email, data.password);
      // The onAuthStateChanged listener will handle the redirect.
      toast({
        title: 'Sign up initiated',
        description: 'Please wait while we create your account.',
      });
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: 'Something went wrong.',
        description: error.message || 'Your sign up request failed. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoCapitalize="none"
                      autoComplete="new-password"
                      autoCorrect="off"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign Up with Email
            </Button>
        </form>
      </Form>
    </div>
  );
}
