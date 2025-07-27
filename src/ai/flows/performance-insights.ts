'use server';

/**
 * @fileOverview An AI agent that analyzes student performance and provides insights.
 *
 * - getPerformanceInsights - A function that handles the performance analysis process.
 * - PerformanceInsightsInput - The input type for the getPerformanceInsights function.
 * - PerformanceInsightsOutput - The return type for the getPerformanceinsights function.
 */

import {ai} from '@/ai/genkit';
import {subjects} from '@/lib/mock-data';
import type {Grade} from '@/lib/types';
import {z} from 'genkit';

const PerformanceInsightsInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  grades: z.array(z.object({
    subjectId: z.string(),
    grade: z.number(),
    feedback: z.string(),
    date: z.string(),
  })).describe("The student's grades and feedback."),
});
export type PerformanceInsightsInput = z.infer<typeof PerformanceInsightsInputSchema>;

const PerformanceInsightsOutputSchema = z.object({
  summary: z.string().describe("A brief, one-paragraph summary of the student's overall performance."),
  strengths: z.array(z.string()).describe('A list of the student\'s key strengths.'),
  areasForImprovement: z.array(z.string()).describe('A list of areas where the student can improve.'),
});
export type PerformanceInsightsOutput = z.infer<typeof PerformanceInsightsOutputSchema>;


export async function getPerformanceInsights(
  input: PerformanceInsightsInput
): Promise<PerformanceInsightsOutput> {
  return performanceInsightsFlow(input);
}

const performanceInsightsPrompt = ai.definePrompt({
  name: 'performanceInsightsPrompt',
  input: {schema: z.object({grades: z.string(), studentName: z.string()})},
  // We are removing the output schema here to avoid Handlebars error and parsing manually below.
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are an expert educational analyst. A teacher needs insights into a student's performance.
Analyze the provided data, which includes grades and teacher feedback for various subjects.

Student Name: {{{studentName}}}
Performance Data (JSON format):
{{{grades}}}

Based on this data, provide a concise analysis. Identify the student's key strengths and areas for improvement.
Your response MUST be a single, valid JSON object with three keys: "summary", "strengths", and "areasForImprovement".

- "summary": A brief, one-paragraph summary of the student's overall performance.
- "strengths": An array of strings, each describing a specific strength (e.g., "Excellent scores in Science").
- "areasForImprovement": An array of strings, each highlighting an area that needs attention (e.g., "Needs to focus on literary analysis in English").
`,
});

const performanceInsightsFlow = ai.defineFlow(
  {
    name: 'performanceInsightsFlow',
    inputSchema: PerformanceInsightsInputSchema,
    outputSchema: PerformanceInsightsOutputSchema,
  },
  async (input) => {
    // Manually map subjectId to subjectName for a more meaningful prompt
    const gradesWithSubjectNames = input.grades.map((g: Grade) => {
        const subject = subjects.find(s => s.id === g.subjectId);
        return {
            subject: subject ? subject.name : 'Unknown Subject',
            grade: g.grade,
            feedback: g.feedback,
            date: g.date
        }
    });

    const llmResponse = await performanceInsightsPrompt({
        studentName: input.studentName,
        grades: JSON.stringify(gradesWithSubjectNames, null, 2)
    });

    const llmResponseText = llmResponse.text.replace(/```json\n?/g, '').replace(/\n?```/g, '').trim();

    try {
        const parsedOutput = JSON.parse(llmResponseText);
        return PerformanceInsightsOutputSchema.parse(parsedOutput);
    } catch (e) {
        console.error("Failed to parse LLM response:", e);
        console.error("Raw LLM response:", llmResponseText);
        throw new Error("The AI returned an invalid response. Please try again.");
    }
  }
);
