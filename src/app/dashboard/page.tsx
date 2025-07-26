import { Suspense } from 'react';
import StudentView from '@/components/dashboard/student-view';
import TeacherView from '@/components/dashboard/teacher-view';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, Shield, Users, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllStudents, getAllSubjects } from '@/lib/mock-data';

async function AdminDashboard() {
    const students = await getAllStudents();
    const subjects = getAllSubjects();

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{students.length}</div>
                        <p className="text-xs text-muted-foreground">students enrolled</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{subjects.length}</div>
                        <p className="text-xs text-muted-foreground">subjects offered</p>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Dashboard Navigation</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 md:flex-row">
                        <Button asChild size="lg" className="w-full md:w-auto">
                            <Link href="/dashboard?role=student">
                                <User className="mr-2" />
                                View as Student
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="w-full md:w-auto">
                            <Link href="/dashboard?role=teacher">
                                <Shield className="mr-2" />
                                View as Teacher
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


function DashboardContent({ role }: { role?: string }) {
    if (role === 'teacher') {
      return <TeacherView />;
    }
    if (role === 'student') {
        return <StudentView studentId="student-1" />;
    }
    // Admin view
    if (role === 'admin') {
        return <AdminDashboard />
    }
    // Default to student view if role is not specified
    return <StudentView studentId="student-1" />;
}

export default function DashboardPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const role = searchParams?.role;

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
