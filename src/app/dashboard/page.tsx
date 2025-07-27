
import StudentDashboard from '@/components/dashboard/student-view';
import TeacherDashboard from '@/components/dashboard/teacher-view';
import { getStudentById, getMaterialsForStudent, getAssignmentsForStudent } from '@/lib/mock-data';
import type { Assignment, Material } from '@/lib/types';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { role?: string; studentId?: string; tab?: string };
}) {
  const role = searchParams?.role;
  const studentId = searchParams?.studentId;

  if (role === 'teacher' || (!role && !studentId)) {
    return <TeacherDashboard />;
  }

  if (role === 'student' && studentId) {
    const student = await getStudentById(studentId);
    if (student) {
      const assignments = await getAssignmentsForStudent(studentId);
      const materials = await getMaterialsForStudent(student);
      return <StudentDashboard student={student} assignments={assignments} materials={materials} />;
    }
     return (
        <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Student with ID "{studentId}" not found.</p>
        </div>
    );
  }

  // Fallback to teacher view if role is invalid
  return <TeacherDashboard />;
}
