
import StudentView from '@/components/dashboard/student-view';
import TeacherView from '@/components/dashboard/teacher-view';
import { getStudentById } from '@/lib/mock-data';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { role?: string; studentId?: string };
}) {
  const role = searchParams?.role;
  const studentId = searchParams?.studentId;

  if (role === 'teacher') {
    return <TeacherView />;
  }

  if (role === 'student' && studentId) {
    const student = await getStudentById(studentId);
    if (student) {
      return <StudentView student={student} />;
    }
     return (
        <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Student with ID "{studentId}" not found.</p>
        </div>
    );
  }

  // Fallback to teacher view if no role is specified or role is invalid
  return <TeacherView />;
}
