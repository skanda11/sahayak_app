// This file invokes the Gemini API to generate performance insights.

'use server';

/**
 * @fileOverview AI-powered tool to summarize a student's strengths and areas of improvement based on their grades and feedback.
 *
 * - getPerformanceInsights - A function that generates performance insights for a student.
 * - PerformanceInsightsInput - The input type for the getPerformanceInsights function.
 * - PerformanceInsightsOutput - The return type for the getPerformanceInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PerformanceInsightsInputSchema = z.object({
  grades: z
    .string()
    .describe('A JSON string of subject names and their corresponding grades (0-100).'),
  feedback: z
    .string()
    .describe('A JSON string of subject names and their corresponding feedback.'),
});
export type PerformanceInsightsInput = z.infer<typeof PerformanceInsightsInputSchema>;

const PerformanceInsightsOutputSchema = z.object({
  summary: z.string().describe('A summary of the student performance including strengths and areas for improvement.'),
});
export type PerformanceInsightsOutput = z.infer<typeof PerformanceInsightsOutputSchema>;

export async function getPerformanceInsights(input: { grades: Record<string, number>, feedback: Record<string, string> }): Promise<PerformanceInsightsOutput> {
  return performanceInsightsFlow({
      grades: JSON.stringify(input.grades),
      feedback: JSON.stringify(input.feedback)
  });
}

const performanceInsightsPrompt = ai.definePrompt({
  name: 'performanceInsightsPrompt',
  input: {schema: PerformanceInsightsInputSchema},
  output: {schema: PerformanceInsightsOutputSchema},
  prompt: `You are a helpful AI assistant that provides performance insights for a student based on their grades and feedback.

  Analyze the student's grades and feedback, and provide a summary of their strengths and areas for improvement.

  Grades: {{{grades}}}
  Feedback: {{{feedback}}}
  `,
});

const performanceInsightsFlow = ai.defineFlow(
  {
    name: 'performanceInsightsFlow',
    inputSchema: PerformanceInsightsInputSchema,
    outputSchema: PerformanceInsightsOutputSchema,
  },
  async input => {
    const {output} = await performanceInsightsPrompt(input);
    return output!;
  }
);
