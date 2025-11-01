import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { LoginForm } from './login-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Logo from '@/components/common/Logo';

export const metadata: Metadata = {
  title: 'Login - Setso',
  description: 'Login to your Setso account.',
};

export default function LoginPage() {
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
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold text-primary underline-offset-4 hover:underline">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
