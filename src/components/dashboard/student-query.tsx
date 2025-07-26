'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { answerStudentQuery } from '@/ai/flows/student-query';
import type { Subject } from '@/lib/types';
import { Loader2, HelpCircle, Bot } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllSubjects } from '@/lib/mock-data';

export default function StudentQuery() {
  const [question, setQuestion] = useState('');
  const [subject, setSubject] = useState('');
  const [result, setResult] = useState<{ answer: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subjects = getAllSubjects();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !subject) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await answerStudentQuery({ question, subject });
      setResult(response);
    } catch (err) {
      console.error(err);
      setError('Failed to get an answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-2">
        <Card className="mb-8">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Ask a Query</CardTitle>
                <CardDescription>Have a question about a topic? Select a subject and ask away. Our AI tutor will help you out.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Select onValueChange={setSubject} value={subject} disabled={isLoading}>
                      <SelectTrigger className="h-11 text-base">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((s: Subject) => (
                          <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="e.g., Can you explain the difference between mitosis and meiosis?"
                        disabled={isLoading}
                        className="h-24 text-base"
                    />
                    <Button type="submit" disabled={isLoading || !question.trim() || !subject} className="h-11 w-full sm:w-auto self-end">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <HelpCircle className="mr-2 h-4 w-4" />}
                        Ask Question
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
                            <Bot />
                            AI Tutor's Answer
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose max-w-none text-foreground">
                            <p style={{whiteSpace: 'pre-wrap'}}>{result.answer}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )}
    </div>
  );
}
