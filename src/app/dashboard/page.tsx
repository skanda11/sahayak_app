
import StudentView from '@/components/dashboard/student-view';
import TeacherView from '@/components/dashboard/teacher-view';

// This is now a Server Component
export default function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const role = searchParams?.role;
  const studentId = searchParams?.studentId as string | undefined;

  if (role === 'teacher') {
    return <TeacherView />;
  }

  if (role === 'student' && studentId) {
    return <StudentView studentId={studentId} />;
  }

  // Fallback if role/studentId is missing or invalid
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-muted-foreground">Please select a valid role to view the dashboard.</p>
    </div>
  );
}
