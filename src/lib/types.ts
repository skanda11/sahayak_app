export interface Grade {
  subjectId: string;
  grade: number;
  feedback: string;
  date: string;
}

export interface Student {
  id: string;
  name: string;
  rollNumber?: string;
  grades: Grade[];
  assignments?: Assignment[];
}

export interface Subject {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface QuizQuestion {
  question: string;
  options: {
    letter: string;
    text: string;
  }[];
  correctAnswer: string;
}

export interface Assignment {
    id: string;
    subjectId: string;
    subjectName: string;
    feedback: string;
    quiz: string; // The generated quiz text
    status: 'pending' | 'completed';
    assignedDate: string;
    completedDate?: string;
}
