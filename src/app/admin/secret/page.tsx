'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/common/Logo';

const ADMIN_SECRET = '20080513';

export default function AdminSecretPage() {
  const [secret, setSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (secret === ADMIN_SECRET) {
      try {
        sessionStorage.setItem('admin-secret-verified', 'true');
        toast({
          title: 'Success',
          description: 'Verification successful. Redirecting...',
        });
        router.replace('/admin');
      } catch (error) {
         toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not set session storage. Please enable cookies and try again.',
        });
        setIsLoading(false);
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid Secret Code',
        description: 'The secret code you entered is incorrect.',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
         <div className="mb-8 flex justify-center">
            <Logo />
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Admin Verification</CardTitle>
            <CardDescription>Enter the secret code to access the admin dashboard.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="secret-code">Secret Code</Label>
                <Input
                  id="secret-code"
                  type="password"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="Enter your secret code"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
