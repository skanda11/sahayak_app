
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, User, Briefcase } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold font-headline text-primary">Welcome to AcademiaTrack</h1>
        <p className="text-xl text-muted-foreground mt-4">Your AI-powered academic companion.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full px-4">
        <Link href="/dashboard" className="group">
          <Card className="hover:shadow-lg hover:border-primary transition-all duration-300">
            <CardHeader className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Briefcase className="h-12 w-12 text-primary" />
                  <div>
                    <CardTitle className="text-3xl font-headline">Teacher</CardTitle>
                    <CardDescription className="text-base">Manage students, input grades, and get insights.</CardDescription>
                  </div>
                </div>
                <ArrowRight className="h-8 w-8 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/student-view?studentId=student-1" className="group">
          <Card className="hover:shadow-lg hover:border-primary transition-all duration-300">
            <CardHeader className="p-8">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <User className="h-12 w-12 text-primary" />
                    <div>
                        <CardTitle className="text-3xl font-headline">Student</CardTitle>
                        <CardDescription className="text-base">View your progress, clarify concepts, and ask questions.</CardDescription>
                    </div>
                  </div>
                <ArrowRight className="h-8 w-8 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
