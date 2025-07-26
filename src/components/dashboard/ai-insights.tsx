"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPerformanceInsights } from '@/ai/flows/performance-insights';
import type { Student } from '@/lib/types';
import { Sparkles, Bot } from 'lucide-react';

export default function AiInsights({ student }: { student: Student }) {
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetInsights = async () => {
    setIsLoading(true);
    setError(null);
    setInsights(null);

    const grades = student.grades.reduce((acc, g) => {
        acc[g.subjectId] = g.grade;
        return acc;
    }, {} as Record<string, number>);

    const feedback = student.grades.reduce((acc, g) => {
        acc[g.subjectId] = g.feedback;
        return acc;
    }, {} as Record<string, string>);

    try {
      const result = await getPerformanceInsights({ grades, feedback });
      setInsights(result.summary);
    } catch (e) {
      setError('Failed to generate insights. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={() => {
        setInsights(null);
        setError(null);
    }}>
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">AI Performance Insights</CardTitle>
            <Sparkles className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">Personalized Analysis</div>
            <DialogTrigger asChild>
                <Button onClick={handleGetInsights} className="mt-2 w-full" size="sm">
                    Generate Insights
                </Button>
            </DialogTrigger>
        </CardContent>
      </Card>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot /> AI Performance Insights for {student.name}
          </DialogTitle>
          <DialogDescription>
            Here is a summary of strengths and areas for improvement based on recent performance.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
          {isLoading && (
            <div className="flex items-center justify-center space-x-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" style={{ animationDelay: '0s' }}></div>
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" style={{ animationDelay: '0.2s' }}></div>
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" style={{ animationDelay: '0.4s' }}></div>
              <p className="text-muted-foreground">Generating insights...</p>
            </div>
          )}
          {error && <p className="text-destructive">{error}</p>}
          {insights && (
            <div className="prose prose-sm max-w-none rounded-md bg-muted p-4 text-muted-foreground">
                <p style={{ whiteSpace: 'pre-wrap' }}>{insights}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
