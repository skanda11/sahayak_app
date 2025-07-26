// Implemented the concept clarification and quiz generation flow.

'use server';

/**
 * @fileOverview An AI agent that clarifies concepts and generates quizzes.
 *
 * - clarifyConceptAndQuiz - A function that handles the concept clarification and quiz generation process.
 * - ClarifyConceptAndQuizInput - The input type for the clarifyConceptAndQuiz function.
 * - ClarifyConceptAndQuizOutput - The return type for the clarifyConceptAndQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClarifyConceptAndQuizInputSchema = z.object({
  concept: z.string().describe('The concept to be clarified.'),
});
export type ClarifyConceptAndQuizInput = z.infer<typeof ClarifyConceptAndQuizInputSchema>;

const ClarifyConceptAndQuizOutputSchema = z.object({
  explanation: z.string().describe('A detailed explanation of the concept.'),
  quiz: z.string().describe('A quiz to test understanding of the concept.'),
});
export type ClarifyConceptAndQuizOutput = z.infer<typeof ClarifyConceptAndQuizOutputSchema>;

export async function clarifyConceptAndQuiz(
  input: ClarifyConceptAndQuizInput
): Promise<ClarifyConceptAndQuizOutput> {
  return clarifyConceptAndQuizFlow(input);
}

const clarifyConceptAndQuizPrompt = ai.definePrompt({
  name: 'clarifyConceptAndQuizPrompt',
  input: {schema: ClarifyConceptAndQuizInputSchema},
  output: {schema: ClarifyConceptAndQuizOutputSchema},
  prompt: `You are an expert tutor. Your task is to clarify a given concept and generate a quiz to test the student's understanding.

Concept: {{{concept}}}

First, provide a detailed explanation of the concept. Then, create a quiz with multiple-choice questions to assess understanding.

Explanation:

Quiz:`, // Fixed: Added Explanation and Quiz prompts
});

const clarifyConceptAndQuizFlow = ai.defineFlow(
  {
    name: 'clarifyConceptAndQuizFlow',
    inputSchema: ClarifyConceptAndQuizInputSchema,
    outputSchema: ClarifyConceptAndQuizOutputSchema,
  },
  async input => {
    const {output} = await clarifyConceptAndQuizPrompt(input);
    return output!;
  }
);
