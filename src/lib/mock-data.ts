import { Book, Calculator, Dna, FlaskConical, Globe } from 'lucide-react';
import type { Student, Subject } from './types';

export const subjects: Subject[] = [
  { id: 'math', name: 'Mathematics', icon: Calculator },
  { id: 'science', name: 'Science', icon: FlaskConical },
  { id: 'english', name: 'English', icon: Book },
  { id: 'history', name: 'History', icon: Globe },
  { id: 'biology', name: 'Biology', icon: Dna },
];

export const students: Student[] = [
  {
    id: 'student-1',
    name: 'Alex Johnson',
    grades: [
      { subjectId: 'math', grade: 85, feedback: 'Good understanding of core concepts.', date: '2023-09-15' },
      { subjectId: 'science', grade: 92, feedback: 'Excellent work in the lab.', date: '2023-09-20' },
      { subjectId: 'english', grade: 78, feedback: 'Needs to work on essay structure.', date: '2023-09-22' },
      { subjectId: 'history', grade: 88, feedback: 'Very insightful analysis.', date: '2023-09-18' },
      { subjectId: 'math', grade: 88, feedback: 'Improved significantly on algebra.', date: '2023-10-15' },
      { subjectId: 'science', grade: 95, feedback: 'Top of the class on the physics test.', date: '2023-10-20' },
      { subjectId: 'english', grade: 82, feedback: 'Great improvement in writing skills.', date: '2023-10-22' },
    ],
  },
  {
    id: 'student-2',
    name: 'Maria Garcia',
    grades: [
      { subjectId: 'math', grade: 95, feedback: 'Exceptional problem-solving skills.', date: '2023-09-15' },
      { subjectId: 'science', grade: 88, feedback: 'Solid effort on the project.', date: '2023-09-20' },
      { subjectId: 'english', grade: 91, feedback: 'Creative and well-written stories.', date: '2023-09-22' },
      { subjectId: 'history', grade: 82, feedback: 'Good participation in discussions.', date: '2023-09-18' },
    ],
  },
  {
    id: 'student-3',
    name: 'Chen Wei',
    grades: [
      { subjectId: 'math', grade: 72, feedback: 'Struggling with geometry, needs extra help.', date: '2023-09-15' },
      { subjectId: 'science', grade: 65, feedback: 'Needs to review lab safety procedures.', date: '2023-09-20' },
      { subjectId: 'english', grade: 80, feedback: 'Strong vocabulary, but grammar needs work.', date: '2023-09-22' },
      { subjectId: 'history', grade: 75, feedback: 'Shows interest but needs to study more for tests.', date: '2023-09-18' },
    ],
  },
];

const teacherEmails = ['1teacher@example.com'];

export function isTeacherEmail(email: string): boolean {
  return teacherEmails.includes(email.toLowerCase());
}

export function getStudentById(id: string): Student | undefined {
  return students.find((s) => s.id === id);
}

export function getSubjectById(id: string): Subject | undefined {
    return subjects.find((s) => s.id === id);
}

export function getAllStudents(): Student[] {
    return students;
}

export function getAllSubjects(): Subject[] {
    return subjects;
}

export function addGrade(studentId: string, subjectId: string, grade: number, feedback: string) {
    const student = getStudentById(studentId);
    if (student) {
        student.grades.push({
            subjectId,
            grade,
            feedback,
            date: new Date().toISOString().split('T')[0],
        });
    }
}
