'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { LogIn } from 'lucide-react';
import { isTeacherEmail } from '@/lib/mock-data';

const auth = getAuth(app);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password'); // Default password for demo
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
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

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      const emailUsername = email.split('@')[0].toLowerCase();
      let role = 'student'; // Default to student
      if (emailUsername.includes('_admin')) {
        role = 'admin';
      } else if (isTeacherEmail(email)) {
        role = 'teacher';
      }

      toast({
        title: 'Login Successful',
        description: `Welcome!`,
        className: 'bg-accent text-accent-foreground',
      });
      
      router.push(`/dashboard?role=${role}`);

    } catch (error: any) {
        let description = "An unknown error occurred.";
        if (error.code === 'auth/user-not-found') {
            description = "This user does not exist. Please check the email or sign up.";
        } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            description = "Invalid credentials. Please check your email and password.";
        } else {
            console.error(error);
        }
        toast({
            title: 'Login Failed',
            description,
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
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
                Use an email like <span className="font-semibold">student@example.com</span>, <span className="font-semibold">teacher@example.com</span>, or <span className="font-semibold">admin@example.com</span>. The password is <span className="font-semibold">password</span>.
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
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
