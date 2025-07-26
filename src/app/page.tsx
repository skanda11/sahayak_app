import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, User } from 'lucide-react';
import { Logo } from '@/components/icons';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl">
        <header className="mb-12 text-center">
          <div className="mb-4 inline-block">
            <Logo className="h-16 w-16 text-primary" />
          </div>
          <h1 className="font-headline text-5xl font-bold text-primary">
            Welcome to AcademiaTrack
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Your personal AI-powered academic companion.
          </p>
        </header>

        <main>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-headline">Student Portal</CardTitle>
                  <CardDescription>View your progress and get help.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-muted-foreground">
                  Access your dashboard to see your grades, track your performance over time, and use our AI tools to clarify concepts and prepare for quizzes.
                </p>
                <Button asChild className="w-full" size="lg">
                  <Link href="/dashboard?role=student">
                    Enter as Student <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-headline">Teacher Portal</CardTitle>
                  <CardDescription>Manage grades and insights.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-muted-foreground">
                  Input grades and feedback for your students. Leverage AI-generated performance insights to support their learning journey effectively.
                </p>
                <Button asChild className="w-full" size="lg">
                  <Link href="/dashboard?role=teacher">
                    Enter as Teacher <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
