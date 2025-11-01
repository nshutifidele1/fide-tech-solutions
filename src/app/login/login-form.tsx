'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Icons } from '@/components/common/icons';
import { useAuth } from '@/firebase';
import { initiateEmailSignIn } from '@/firebase/non-blocking-login';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof loginUserSchema>;

export function LoginForm({ className, ...props }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginUserSchema),
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
      initiateEmailSignIn(auth, data.email, data.password);
      // The onAuthStateChanged listener will handle the redirect.
      toast({
        title: 'Login Initiated',
        description: 'Please wait while we sign you in.',
      });
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Something went wrong.',
        description: 'Your sign in request failed. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register('email')}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="password"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              disabled={isLoading}
              {...register('password')}
            />
            {errors?.password && (
              <p className="px-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <button className={cn(buttonVariants())} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </button>
        </div>
      </form>
    </div>
  );
}
