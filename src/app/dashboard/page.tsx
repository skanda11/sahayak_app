
'use client';

import { useSearchParams } from 'next/navigation';
import StudentView from '@/components/dashboard/student-view';
import TeacherView from '@/components/dashboard/teacher-view';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');
  const studentId = searchParams.get('studentId');

  // Display a loading skeleton while waiting for params
  if (!role) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Skeleton className="h-[400px] w-full" />
                </div>
                <div>
                    <Skeleton className="h-[400px] w-full" />
                </div>
            </div>
        </div>
    )
  }

  if (role === 'teacher') {
    return <TeacherView />;
  }

  if (role === 'student' && studentId) {
    return <StudentView studentId={studentId} />;
  }

  // Fallback if role/studentId is missing or invalid
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-muted-foreground">Please select a valid role to view the dashboard.</p>
    </div>
  );
}
