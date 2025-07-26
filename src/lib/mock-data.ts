import { Book, Calculator, Dna, FlaskConical, Globe } from 'lucide-react';
import type { Student, Subject, Grade, Assignment, Material, Content } from './types';
import { db } from './firebase';
import { doc, getDoc, getDocs, collection, setDoc, writeBatch, query, where, limit, updateDoc, addDoc } from 'firebase/firestore';
import { generateAssignment } from '@/ai/flows/assignment-generation';

export const subjects: Subject[] = [
  { id: 'math', name: 'Mathematics', icon: Calculator },
  { id: 'science', name: 'Science', icon: FlaskConical },
  { id: 'english', name: 'English', icon: Book },
  { id: 'history', name: 'History', icon: Globe },
  { id: 'biology', name: 'Biology', icon: Dna },
];

const mockStudents: Omit<Student, 'grades' | 'assignments'> & { grades: Omit<Grade, 'date'>[] }[] = [
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

export async function createMaterialRef(classId: string, subjectId: string) {
    // This creates a reference to a new document with an auto-generated ID
    // in the collection materials/{classId}/{subjectId}
    const newDocRef = doc(collection(db, 'materials', classId, subjectId));
    // We need to ensure the parent documents exist, otherwise the path is invalid.
    await setDoc(doc(db, 'materials', classId), {}, { merge: true });
    return newDocRef;
}

export async function updateMaterial(materialRef: any, material: Partial<Omit<Material, 'id'>>) {
    await setDoc(materialRef, material);
}


export async function getMaterialsForSubject(classroom: string, subjectId: string): Promise<Material[]> {
  const materialsRef = collection(db, 'materials', classroom, subjectId);
  const snapshot = await getDocs(materialsRef);
  if (snapshot.empty) {
    return [];
  }
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Material));
}


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

  const assignmentsCollectionRef = collection(db, 'students', id, 'assignments');
  const assignmentsSnapshot = await getDocs(assignmentsCollectionRef);
  const assignments = assignmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Assignment));


  return {
    id: studentDoc.id,
    name: studentData.name,
    rollNumber: studentData.rollNumber,
    grades: grades,
    assignments: assignments,
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

      const assignmentsCollectionRef = collection(db, 'students', studentDoc.id, 'assignments');
      const assignmentsSnapshot = await getDocs(assignmentsCollectionRef);
      const assignments = assignmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Assignment));

      return {
        id: studentDoc.id,
        name: studentData.name,
        rollNumber: studentData.rollNumber,
        grades: grades,
        assignments: assignments,
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

export async function createAssignment(studentId: string, subjectId: string, subjectName: string, feedback: string) {
    const { quiz } = await generateAssignment({ subject: subjectName, feedback });
    
    if (!quiz) {
        throw new Error("Failed to generate quiz for assignment.");
    }

    const assignmentData: Omit<Assignment, 'id'> = {
        subjectId,
        subjectName,
        feedback,
        quiz,
        status: 'pending',
        assignedDate: new Date().toISOString().split('T')[0],
    };

    const assignmentsCollectionRef = collection(db, 'students', studentId, 'assignments');
    await setDoc(doc(assignmentsCollectionRef), assignmentData);
}

export async function completeAssignment(studentId: string, assignmentId: string) {
    const assignmentRef = doc(db, 'students', studentId, 'assignments', assignmentId);
    await updateDoc(assignmentRef, {
        status: 'completed',
        completedDate: new Date().toISOString().split('T')[0],
    });
}

export async function addContent(content: Omit<Content, 'id'>) {
    await addDoc(collection(db, 'content'), content);
}

export async function getAllContent(): Promise<Content[]> {
    const contentCollectionRef = collection(db, 'content');
    const contentSnapshot = await getDocs(contentCollectionRef);
    if (contentSnapshot.empty) {
        return [];
    }
    return contentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Content)).sort((a,b) => a.subjectName.localeCompare(b.subjectName));
}

export async function updateContentStatus(contentId: string, status: 'reviewed' | 'under-review') {
    const contentRef = doc(db, 'content', contentId);
    await updateDoc(contentRef, { status });
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
