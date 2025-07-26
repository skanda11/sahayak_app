'use server';

/**
 * @fileOverview An AI agent that generates educational session content based on a topic, grade, and subject.
 *
 * - generateSessionContent - A function that handles the session content generation process.
 * - GenerateSessionContentInput - The input type for the generateSessionContent function.
 * - GenerateSessionContentOutput - The return type for the generateSessionContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSessionContentInputSchema = z.object({
  topic: z.string().describe('The topic for the session content.'),
  subject: z.string().describe('The subject of the session.'),
  grade: z.string().describe('The grade or class for which the content is being generated.'),
});
export type GenerateSessionContentInput = z.infer<typeof GenerateSessionContentInputSchema>;

const GenerateSessionContentOutputSchema = z.object({
  sessionContent: z.string().describe('The generated content for the educational session.'),
});
export type GenerateSessionContentOutput = z.infer<typeof GenerateSessionContentOutputSchema>;

export async function generateSessionContent(
  input: GenerateSessionContentInput
): Promise<GenerateSessionContentOutput> {
  return sessionContentGenerationFlow(input);
}

const sessionContentGenerationPrompt = ai.definePrompt({
  name: 'sessionContentGenerationPrompt',
  input: {schema: GenerateSessionContentInputSchema},
  output: {schema: GenerateSessionContentOutputSchema},
  prompt: `You are an expert curriculum designer and educator. Your task is to generate detailed session content for a specific topic, subject, and grade level.

The content should be engaging, informative, and tailored to the complexity appropriate for the specified grade.

Grade: {{{grade}}}
Subject: {{{subject}}}
Topic: {{{topic}}}

Generate the session content below. It should be structured with clear headings, explanations, examples, and where appropriate, a few practice questions.`,
});

const sessionContentGenerationFlow = ai.defineFlow(
  {
    name: 'sessionContentGenerationFlow',
    inputSchema: GenerateSessionContentInputSchema,
    outputSchema: GenerateSessionContentOutputSchema,
  },
  async input => {
    const {output} = await sessionContentGenerationPrompt(input);
    return output!;
  }
);
