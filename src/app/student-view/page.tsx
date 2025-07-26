
'use client'

import { useSearchParams } from 'next/navigation';
import StudentView from '@/components/dashboard/student-view';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function StudentViewLoading() {
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

function StudentViewPageContent() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');

  if (!studentId) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Please select a student to view the dashboard.</p>
      </div>
    );
  }

  return <StudentView studentId={studentId} />;
}

export default function StudentViewPage() {
    return (
        <Suspense fallback={<StudentViewLoading />}>
            <StudentViewPageContent />
        </Suspense>
    )
}
