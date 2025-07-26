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

export interface Material {
  id: string;
  name: string;
  url: string; // URL to the stored file
  type: 'textbook' | 'reference' | 'notes';
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

export interface Content {
  id: string;
  subjectId: string;
  grade: string;
  sessionNumber: number;
  sessionTitle: string;
  sessionContent: string;
  status: 'under-review' | 'reviewed';
}
