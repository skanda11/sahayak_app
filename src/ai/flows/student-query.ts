'use server';

/**
 * @fileOverview An AI agent that answers student queries.
 *
 * - answerStudentQuery - A function that handles answering a student's question.
 * - StudentQueryInput - The input type for the answerStudentQuery function.
 * - StudentQueryOutput - The return type for the answerStudentQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudentQueryInputSchema = z.object({
  question: z.string().describe('The question the student is asking.'),
  subject: z.string().describe('The subject the question belongs to.'),
});
export type StudentQueryInput = z.infer<typeof StudentQueryInputSchema>;

const StudentQueryOutputSchema = z.object({
  answer: z.string().describe('A detailed answer to the student\'s question.'),
});
export type StudentQueryOutput = z.infer<typeof StudentQueryOutputSchema>;

export async function answerStudentQuery(
  input: StudentQueryInput
): Promise<StudentQueryOutput> {
  return studentQueryFlow(input);
}

const studentQueryPrompt = ai.definePrompt({
  name: 'studentQueryPrompt',
  input: {schema: StudentQueryInputSchema},
  output: {schema: StudentQueryOutputSchema},
  prompt: `You are an expert tutor for the given subject. Your task is to provide a clear and detailed answer to the student's question.

Subject: {{{subject}}}
Question: {{{question}}}

Answer the question in a way that is easy to understand for a student.`,
});

const studentQueryFlow = ai.defineFlow(
  {
    name: 'studentQueryFlow',
    inputSchema: StudentQueryInputSchema,
    outputSchema: StudentQueryOutputSchema,
  },
  async input => {
    const {output} = await studentQueryPrompt(input);
    return output!;
  }
);
