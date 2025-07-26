
import StudentView from '@/components/dashboard/student-view';
import TeacherView from '@/components/dashboard/teacher-view';

// This is now a Server Component
export default function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const role = searchParams.role;
  const studentId = searchParams.studentId;

  if (role === 'teacher') {
    return <TeacherView />;
  }

  // The check for studentId is important
  if (role === 'student' && typeof studentId === 'string' && studentId) {
    return <StudentView studentId={studentId} />;
  }

  // Fallback if role/studentId is missing
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-muted-foreground">Please log in to view your dashboard.</p>
    </div>
  );
}
