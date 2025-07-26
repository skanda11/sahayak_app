import { Suspense } from 'react';
import StudentView from '@/components/dashboard/student-view';
import TeacherView from '@/components/dashboard/teacher-view';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, Shield } from 'lucide-react';

function DashboardContent({ role }: { role?: string }) {
    if (role === 'teacher') {
      return <TeacherView />;
    }
    if (role === 'student') {
        return <StudentView studentId="student-1" />;
    }
    // Admin view
    if (role === 'admin') {
        return (
            <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center space-y-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Select a view to proceed.</p>
                <div className="flex gap-4">
                    <Button asChild size="lg">
                        <Link href="/dashboard?role=student">
                            <User className="mr-2" />
                            View as Student
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href="/dashboard?role=teacher">
                            <Shield className="mr-2" />
                            View as Teacher
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }
    // Default to student view
    return <StudentView studentId="student-1" />;
}

export default function DashboardPage({
  searchParams,
}: {
  searchParams?: { role?: string };
}) {
  const role = searchParams?.role || 'student';

  return (
    <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent role={role} />
    </Suspense>
  );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                <Skeleton className="h-80 w-full" />
                <Skeleton className="h-80 w-full" />
            </div>
        </div>
    )
}
