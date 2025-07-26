
'use client';

import { Suspense, useState, useEffect } from 'react';
import StudentView from '@/components/dashboard/student-view';
import TeacherView from '@/components/dashboard/teacher-view';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, Shield, Users, BookOpen, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getAllStudents, getAllSubjects, seedDatabase } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';


function AdminDashboard() {
    const [students, setStudents] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        getAllStudents().then(setStudents);
        setSubjects(getAllSubjects());
    }, []);
    
    const handleSeed = async () => {
        const result = await seedDatabase();
        toast({
            title: result.success ? 'Database Seeded' : 'Seeding Skipped',
            description: result.message,
            variant: result.success ? 'default' : 'destructive',
            className: result.success ? "bg-accent text-accent-foreground" : "",
        });
        if (result.success) {
            const latestStudents = await getAllStudents();
            setStudents(latestStudents);
            router.refresh();
        }
    };


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
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Database Actions</CardTitle>
                         <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleSeed} size="sm" className="w-full">Seed Database</Button>
                        <p className="text-xs text-muted-foreground mt-2">Add mock data if empty.</p>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Dashboard Navigation</CardTitle>
                        <CardDescription>Switch between different user roles to see their views.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 md:flex-row">
                        <Button asChild size="lg" className="w-full md:w-auto">
                            <Link href="/dashboard?role=student&studentId=student-1">
                                <User className="mr-2" />
                                View as Student 1
                            </Link>
                        </Button>
                         <Button asChild size="lg" className="w-full md:w-auto">
                            <Link href="/dashboard?role=student&studentId=student-2">
                                <User className="mr-2" />
                                View as Student 2
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


function DashboardContent() {
    const searchParams = useSearchParams();
    const role = searchParams.get('role');
    const studentId = searchParams.get('studentId');

    if (role === 'teacher') {
      return <TeacherView />;
    }
    if (role === 'student' && studentId) {
        return <StudentView studentId={studentId} />;
    }
    
    return <AdminDashboard />;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
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
