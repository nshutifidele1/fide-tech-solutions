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
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
             <div className="mb-4 flex justify-center">
                <Logo />
            </div>
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <LoginForm />
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
      {loginImage && (
         <Image
            src={loginImage.imageUrl}
            alt={loginImage.description}
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.6]"
            data-ai-hint={loginImage.imageHint}
          />
      )}
      </div>
    </div>
  );
}
