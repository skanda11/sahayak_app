import { Suspense } from 'react';
import StudentView from '@/components/dashboard/student-view';
import TeacherView from '@/components/dashboard/teacher-view';
import { Skeleton } from '@/components/ui/skeleton';

function DashboardContent({ role }: { role?: string }) {
    if (role === 'teacher') {
      return <TeacherView />;
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
