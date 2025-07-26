export interface Grade {
  subjectId: string;
  grade: number;
  feedback: string;
  date: string;
}

export interface Student {
  id: string;
  name: string;
  grades: Grade[];
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
