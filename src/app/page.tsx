'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email) {
      toast({
        title: 'Error',
        description: 'Please enter your email.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    // Simulate role-based redirection
    let role = 'student';
    if (email.toLowerCase() === 'teacher@example.com') {
      role = 'teacher';
    } else if (email.toLowerCase().includes('student')) {
      role = 'student';
    }

    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Login Successful',
        description: `Welcome! Redirecting to the ${role} dashboard.`,
        className: 'bg-accent text-accent-foreground',
      });
      router.push(`/dashboard?role=${role}`);
    }, 1000);
  };
  
  if (!isClient) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <header className="mb-8 text-center">
          <div className="mb-4 inline-block">
            <Logo className="h-16 w-16 text-primary" />
          </div>
          <h1 className="font-headline text-4xl font-bold text-primary">
            Welcome to AcademiaTrack
          </h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to access your dashboard.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Use <span className="font-semibold">teacher@example.com</span> or <span className="font-semibold">student@example.com</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  'Logging in...'
                ) : (
                  <>
                    <LogIn className="mr-2" />
                    Login
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
