'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Assignment, QuizQuestion } from '@/lib/types';
import { BookCheck, FileQuestion } from 'lucide-react';
import QuizClient from '@/components/concept-clarification/quiz-client';
import { completeAssignment } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';

// Helper function to parse the quiz text into a structured format
function parseQuiz(quizText: string): QuizQuestion[] {
  if (!quizText) return [];
  const questions: QuizQuestion[] = [];
  const questionBlocks = quizText.split(/\n(?=\d+\.)/).filter(block => block.trim() !== '');

  questionBlocks.forEach(block => {
    const lines = block.trim().split('\n');
    const questionLine = lines[0].replace(/^\d+\.\s*/, '');
    const options = lines.slice(1, -1).map(line => {
        const match = line.match(/^([A-D])\)\s*(.*)/);
        return match ? { letter: match[1], text: match[2] } : null;
    }).filter(Boolean) as { letter: string; text: string }[];
    const answerLine = lines[lines.length - 1];
    const correctAnswerMatch = answerLine.match(/Correct Answer:\s*([A-D])/);
    const correctAnswer = correctAnswerMatch ? correctAnswerMatch[1] : '';
    
    if (questionLine && options.length > 0 && correctAnswer) {
        questions.push({ question: questionLine, options, correctAnswer });
    }
  });

  return questions;
}

export default function AssignmentView({ assignment, studentId }: { assignment: Assignment, studentId: string }) {
  const router = useRouter();
  const [showQuiz, setShowQuiz] = useState(false);
  
  const quiz = parseQuiz(assignment.quiz);

  const handleComplete = async () => {
    await completeAssignment(studentId, assignment.id);
    router.refresh();
  }

  if (assignment.status === 'completed') {
    return (
        <Card className="bg-green-50 border-green-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                    <BookCheck />
                    Assignment Completed
                </CardTitle>
                <CardDescription className="text-green-700">
                    Great job on completing this assignment on {assignment.subjectName}!
                </CardDescription>
            </CardHeader>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Assignment: {assignment.subjectName}</CardTitle>
                <CardDescription>Based on feedback from your teacher.</CardDescription>
            </div>
             {showQuiz && (
                <Button variant="secondary" onClick={handleComplete}>Mark as Complete</Button>
            )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-muted p-4">
            <p className="font-semibold">Teacher's Feedback:</p>
            <p className="text-muted-foreground">"{assignment.feedback}"</p>
        </div>

        {!showQuiz && (
             <Button onClick={() => setShowQuiz(true)} className="w-full">
                <FileQuestion className="mr-2"/>
                Start Quiz
            </Button>
        )}

        {showQuiz && quiz.length > 0 && (
            <div className="border-t pt-4">
                <QuizClient questions={quiz} />
            </div>
        )}
      </CardContent>
    </Card>
  );
}
