
'use client';

import { Suspense } from 'react';
import StudentView from '@/components/dashboard/student-view';
import TeacherView from '@/components/dashboard/teacher-view';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';


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
    
    // Fallback skeleton while search params are resolving on the client
    return <DashboardSkeleton />;
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
