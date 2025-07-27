
import StudentDashboard from '@/components/dashboard/student-view';
import TeacherDashboard from '@/components/dashboard/teacher-dashboard';
import { getStudentById, getMaterialsForStudent } from '@/lib/mock-data';
import type { Assignment, Material } from '@/lib/types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { redirect } from 'next/navigation';

async function getAssignmentsForStudent(studentId: string): Promise<Assignment[]> {
    const assignmentsCollectionRef = collection(db, 'students', studentId, 'assignments');
    const assignmentsSnapshot = await getDocs(assignmentsCollectionRef);
    if (assignmentsSnapshot.empty) {
        return [];
    }
    return assignmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Assignment)).sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime();
    });
}


export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { role?: string; studentId?: string };
}) {
  const role = searchParams?.role;
  const studentId = searchParams?.studentId;

  if (role === 'teacher') {
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

  // Fallback to teacher view if no role is specified or role is invalid
  return <TeacherDashboard />;
}
