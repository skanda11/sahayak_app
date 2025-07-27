// src/components/dashboard/ai-insights.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPerformanceInsights } from '@/ai/flows/performance-insights';
import type { Student } from '@/lib/types';
import { Sparkles, Bot, Loader2 } from 'lucide-react';

interface AiOutput {
  strengths: string[];
  areasForImprovement: string[];
  summary: string;
}

export function AiInsights({ student }: { student: Student }) {
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetInsights = async () => {
    setIsLoading(true);
    setError(null);
    setAiResult(null);
    try {
      const result = await getPerformanceInsights({
        studentName: student.name,
        grades: student.grades,
      });
      setAiResult(result);
    } catch (e) {
      console.error(e);
      setError('Failed to generate insights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Sparkles className="mr-2 h-4 w-4" />
          Generate personal insights
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Bot className="mr-2 h-5 w-5" />
            AI Performance Insights for {student.name}
          </DialogTitle>
          <DialogDescription>
            Click the button below to generate an AI-powered summary of this student's performance based on their recent grades and feedback.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Button onClick={handleGetInsights} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Insights...
              </>
            ) : (
              'Generate Insights'
            )}
          </Button>
        </div>
        {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}
        {aiResult && (
          <Card>
            <CardHeader>
              <CardTitle>Analysis Complete</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold">Summary</h4>
                <p className="text-sm text-muted-foreground">{aiResult.summary}</p>
              </div>
              <div>
                <h4 className="font-semibold">Strengths</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {aiResult.strengths.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">Areas for Improvement</h4>
                 <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {aiResult.areasForImprovement.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
