'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { clarifyConceptAndQuiz } from '@/ai/flows/concept-clarification';
import type { QuizQuestion } from '@/lib/types';
import { Loader2, Lightbulb, FileQuestion } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import QuizClient from '@/components/concept-clarification/quiz-client';

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

export default function ConceptClarificationPage() {
  const [concept, setConcept] = useState('');
  const [result, setResult] = useState<{ explanation: string; quiz: QuizQuestion[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await clarifyConceptAndQuiz({ concept });
      const parsedQuiz = parseQuiz(response.quiz);
      setResult({ explanation: response.explanation, quiz: parsedQuiz });
    } catch (err) {
      console.error(err);
      setError('Failed to clarify concept. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-2">
        <Card className="mb-8">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Concept Clarifier</CardTitle>
                <CardDescription>Enter a concept you want to understand better. Our AI will provide a clear explanation and a short quiz.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex items-center gap-4">
                    <Input
                        value={concept}
                        onChange={(e) => setConcept(e.target.value)}
                        placeholder="e.g., Photosynthesis, Pythagorean theorem, Black holes"
                        disabled={isLoading}
                        className="h-11 text-base"
                    />
                    <Button type="submit" disabled={isLoading || !concept.trim()} className="h-11">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                        Clarify
                    </Button>
                </form>
            </CardContent>
        </Card>

        {error && (
            <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {result && (
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lightbulb />
                            Explanation: {concept}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose max-w-none text-foreground">
                            <p style={{whiteSpace: 'pre-wrap'}}>{result.explanation}</p>
                        </div>
                    </CardContent>
                </Card>

                {result.quiz.length > 0 && (
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileQuestion />
                                Knowledge Check
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <QuizClient questions={result.quiz} />
                        </CardContent>
                    </Card>
                )}
            </div>
        )}
    </div>
  );
}
