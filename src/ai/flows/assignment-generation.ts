'use server';

/**
 * @fileOverview An AI agent that generates an assignment with a quiz based on teacher feedback.
 *
 * - generateAssignment - A function that handles the assignment generation process.
 * - GenerateAssignmentInput - The input type for the generateAssignment function.
 * - GenerateAssignmentOutput - The return type for the generateAssignment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAssignmentInputSchema = z.object({
  feedback: z.string().describe('The feedback provided by the teacher, which will be used as the basis for the assignment.'),
  subject: z.string().describe('The subject the feedback is for.'),
});
export type GenerateAssignmentInput = z.infer<typeof GenerateAssignmentInputSchema>;

const GenerateAssignmentOutputSchema = z.object({
  quiz: z.string().describe('A quiz with multiple-choice questions to assess understanding of the concepts mentioned in the feedback.'),
});
export type GenerateAssignmentOutput = z.infer<typeof GenerateAssignmentOutputSchema>;

export async function generateAssignment(
  input: GenerateAssignmentInput
): Promise<GenerateAssignmentOutput> {
  return assignmentGenerationFlow(input);
}

const assignmentGenerationPrompt = ai.definePrompt({
  name: 'assignmentGenerationPrompt',
  input: {schema: GenerateAssignmentInputSchema},
  output: {schema: GenerateAssignmentOutputSchema},
  prompt: `You are an expert tutor. Your task is to create a quiz for a student based on feedback from their teacher for a specific subject. The quiz should help the student improve on the areas mentioned in the feedback.

Subject: {{{subject}}}
Teacher's Feedback: "{{{feedback}}}"

Based on the feedback, create a multiple-choice quiz with 3-5 questions that will test the student's understanding of the key concepts they need to work on. For each question, provide four options (A, B, C, D) and indicate the correct answer.
`,
});

const assignmentGenerationFlow = ai.defineFlow(
  {
    name: 'assignmentGenerationFlow',
    inputSchema: GenerateAssignmentInputSchema,
    outputSchema: GenerateAssignmentOutputSchema,
  },
  async input => {
    const {output} = await assignmentGenerationPrompt(input);
    return output!;
  }
);
