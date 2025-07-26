
import StudentView from '@/components/dashboard/student-view';
import { getStudentById } from '@/lib/mock-data';

// This is now an async Server Component
export default async function StudentViewPage({
  searchParams,
}: {
  searchParams?: { studentId?: string };
}) {
  const studentId = searchParams?.studentId;

  if (!studentId) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Please select a student to view the dashboard.</p>
      </div>
    );
  }

  const student = await getStudentById(studentId);

  if (!student) {
    return (
        <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Student with ID "{studentId}" not found.</p>
        </div>
    );
  }

  // We pass the fetched student data to the client component
  return <StudentView student={student} />;
}
