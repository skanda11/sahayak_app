import { Book, Calculator, Dna, FlaskConical, Globe } from 'lucide-react';
import type { Student, Subject, Grade } from './types';
import { db } from './firebase';
import { doc, getDoc, getDocs, collection, setDoc, writeBatch, query, where, limit } from 'firebase/firestore';

export const subjects: Subject[] = [
  { id: 'math', name: 'Mathematics', icon: Calculator },
  { id: 'science', name: 'Science', icon: FlaskConical },
  { id: 'english', name: 'English', icon: Book },
  { id: 'history', name: 'History', icon: Globe },
  { id: 'biology', name: 'Biology', icon: Dna },
];

const mockStudents: Omit<Student, 'grades'> & { grades: Omit<Grade, 'date'>[] }[] = [
    {
      id: 'student-1',
      name: 'Alex Johnson',
      rollNumber: 'R001',
      grades: [
        { subjectId: 'math', grade: 85, feedback: 'Good understanding of core concepts.'},
        { subjectId: 'science', grade: 92, feedback: 'Excellent lab report.'},
        { subjectId: 'english', grade: 78, feedback: 'Needs to work on literary analysis.'},
        { subjectId: 'history', grade: 88, feedback: 'Strong grasp of historical events.'},
      ],
    },
    {
      id: 'student-2',
      name: 'Maria Garcia',
      rollNumber: 'R002',
      grades: [
        { subjectId: 'math', grade: 95, feedback: 'Outstanding performance on the exam.'},
        { subjectId: 'science', grade: 81, feedback: 'Participation in class is improving.'},
        { subjectId: 'english', grade: 90, feedback: 'Very creative and well-written essay.'},
        { subjectId: 'biology', grade: 86, feedback: 'Solid understanding of cell structures.'},
      ],
    },
    {
      id: 'student-3',
      name: 'Sam Lee',
      rollNumber: 'R003',
      grades: [
        { subjectId: 'math', grade: 72, feedback: 'Struggled with algebra but improving.'},
        { subjectId: 'history', grade: 94, feedback: 'Excellent research paper.'},
        { subjectId: 'english', grade: 85, feedback: 'Good participation in class discussions.'},
      ],
    },
];


const teacherEmails = ['teacher1@example.com'];

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
    rollNumber: studentData.rollNumber,
    grades: grades,
  };
}

export async function getStudentByRollNumber(rollNumber: string): Promise<Pick<Student, 'id' | 'name'> | null> {
    const studentsRef = collection(db, 'students');
    const q = query(studentsRef, where("rollNumber", "==", rollNumber), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    const studentDoc = querySnapshot.docs[0];
    const studentData = studentDoc.data();

    return {
        id: studentDoc.id,
        name: studentData.name,
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
        rollNumber: studentData.rollNumber,
        grades: grades,
      };
    })
  );

  return allStudents;
}

export function getAllSubjects(): Subject[] {
    return subjects;
}

export async function addGrade(studentId: string, studentName: string, subjectId: string, grade: number, feedback: string, rollNumber?: string) {
    const studentRef = doc(db, 'students', studentId);
    const studentSnap = await getDoc(studentRef);

    if (!studentSnap.exists()) {
      await setDoc(studentRef, { name: studentName, rollNumber: rollNumber || '' });
    }
    
    const gradeData = {
      subjectId,
      grade,
      feedback,
      date: new Date().toISOString().split('T')[0],
    };
    const gradesCollectionRef = collection(db, 'students', studentId, 'grades');
    await setDoc(doc(gradesCollectionRef), gradeData);
}

export async function seedDatabase() {
    const studentsCollectionRef = collection(db, 'students');
    const studentsSnapshot = await getDocs(studentsCollectionRef);
    if (!studentsSnapshot.empty) {
        console.log('Database already has students. Seeding skipped.');
        return { success: false, message: 'Database already contains student data.' };
    }

    const batch = writeBatch(db);
    let gradeCount = 0;

    mockStudents.forEach(student => {
        const studentRef = doc(db, 'students', student.id);
        batch.set(studentRef, { name: student.name, rollNumber: student.rollNumber });

        student.grades.forEach((grade, index) => {
            const gradeRef = doc(collection(db, 'students', student.id, 'grades'));
            const date = new Date();
            date.setDate(date.getDate() - (student.grades.length - index)); // Stagger dates
            batch.set(gradeRef, { ...grade, date: date.toISOString().split('T')[0] });
            gradeCount++;
        });
    });

    await batch.commit();
    console.log('Database seeded successfully.');
    return { success: true, message: `Successfully seeded ${mockStudents.length} students and ${gradeCount} grades.` };
}
