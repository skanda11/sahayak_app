// src/components/dashboard/ai-insights.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// 👇 Corrected the import to use the session content flow
import { generateSessionContent } from '@/ai/flows/session-content-generation';
import type { Student } from '@/lib/types';
import { Sparkles, Bot } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// Define the structure for the AI's output
interface AiOutput {
  sessionTitle: string;
  sessionContent: string;
}

export function AiInsights({ student }: { student: Student }) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateClick = async () => {
    if (!prompt) {
      setError('Please enter a topic or question.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAiResult(null);
    try {
      // 👇 Call the correct, imported function with the right input
      const result = await generateSessionContent({ prompt });
      setAiResult(result);
    } catch (e) {
      console.error(e);
      setError('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Educational Content
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Bot className="mr-2 h-5 w-5" />
            AI Content Generator
          </DialogTitle>
          <DialogDescription>
            Enter a topic, question, or concept to generate a custom learning session for {student.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="prompt">Topic or Question</Label>
            <Textarea
              id="prompt"
              placeholder="e.g., 'Explain the water cycle' or 'Create a short quiz on photosynthesis'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <Button onClick={handleGenerateClick} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate'}
          </Button>
        </div>
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        {aiResult && (
          <Card>
            <CardHeader>
              <CardTitle>{aiResult.sessionTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: aiResult.sessionContent }}
              />
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}