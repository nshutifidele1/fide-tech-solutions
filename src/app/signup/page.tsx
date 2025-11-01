import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { SignUpForm } from './signup-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Logo from '@/components/common/Logo';

export const metadata: Metadata = {
  title: 'Sign Up - Setso',
  description: 'Create an account on Setso.',
};

export default function SignUpPage() {
  const loginImage = PlaceHolderImages.find((p) => p.id === 'login-1');
  
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center">
       {loginImage && (
         <Image
            src={loginImage.imageUrl}
            alt={loginImage.description}
            fill
            className="absolute inset-0 h-full w-full object-cover"
            data-ai-hint={loginImage.imageHint}
          />
      )}
       <div className="absolute inset-0 bg-black/60" />

       <Card className="relative z-10 w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
                <Logo />
            </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create an Account</CardTitle>
          <CardDescription>Enter your email below to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Already have an account? Sign In
            </Link>
          </p>
          <p className="px-8 text-center text-xs text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
