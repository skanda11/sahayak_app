import { Book, Calculator, Dna, FlaskConical, Globe } from 'lucide-react';
import type { Student, Subject, Grade } from './types';
import { db } from './firebase';
import { doc, getDoc, collection, getDocs, setDoc } from 'firebase/firestore';

export const subjects: Subject[] = [
  { id: 'math', name: 'Mathematics', icon: Calculator },
  { id: 'science', name: 'Science', icon: FlaskConical },
  { id: 'english', name: 'English', icon: Book },
  { id: 'history', name: 'History', icon: Globe },
  { id: 'biology', name: 'Biology', icon: Dna },
];

const teacherEmails = ['teacher@example.com'];

export function isTeacherEmail(email: string): boolean {
  return teacherEmails.includes(email.toLowerCase());
}

export async function getStudentById(id: string): Promise<Student | undefined> {
  const studentDocRef = doc(db, 'students', id);
  const studentDoc = await getDoc(studentDocRef);

  if (!studentDoc.exists()) {
    return undefined;
  }

  const studentData = studentDoc.data();
  const gradesCollectionRef = collection(db, 'students', id, 'grades');
  const gradesSnapshot = await getDocs(gradesCollectionRef);
  const grades = gradesSnapshot.docs.map(doc => doc.data() as Grade);

  return {
    id: studentDoc.id,
    name: studentData.name,
    grades: grades,
  };
}

export function getSubjectById(id: string): Subject | undefined {
    return subjects.find((s) => s.id === id);
}

export async function getAllStudents(): Promise<Student[]> {
  const studentsCollectionRef = collection(db, 'students');
  const studentsSnapshot = await getDocs(studentsCollectionRef);

  if (studentsSnapshot.empty) {
    return [];
  }

  const allStudents = await Promise.all(
    studentsSnapshot.docs.map(async (studentDoc) => {
      const studentData = studentDoc.data();
      const gradesCollectionRef = collection(db, 'students', studentDoc.id, 'grades');
      const gradesSnapshot = await getDocs(gradesCollectionRef);
      const grades = gradesSnapshot.docs.map((doc) => doc.data() as Grade);

      return {
        id: studentDoc.id,
        name: studentData.name,
        grades: grades,
      };
    })
  );

  return allStudents;
}

export function getAllSubjects(): Subject[] {
    return subjects;
}

export async function addGrade(studentId: string, subjectId: string, grade: number, feedback: string) {
    const studentRef = doc(db, 'students', studentId);
    const studentSnap = await getDoc(studentRef);

    if (studentSnap.exists()) {
      const gradeData = {
        subjectId,
        grade,
        feedback,
        date: new Date().toISOString().split('T')[0],
      };
      const gradesCollectionRef = collection(db, 'students', studentId, 'grades');
      // Add a new document with a generated id.
      await setDoc(doc(gradesCollectionRef), gradeData);
    } else {
        console.error(`Student with id ${studentId} not found in Firestore.`);
    }
}
