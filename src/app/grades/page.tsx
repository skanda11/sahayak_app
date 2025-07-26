
import { getAllStudents, getAllSubjects } from '@/lib/mock-data';
import GradesView from '@/components/grades/grades-view';

export default async function GradesPage() {
  const students = await getAllStudents();
  const subjects = getAllSubjects();
  
  return <GradesView students={students} subjects={subjects} />;
}
