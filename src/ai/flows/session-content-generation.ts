// src/ai/flows/session-content-generation.ts

'use server';

import {ai} from '@/ai/genkit';
// Remove the googleAI import, it's not needed here
import {z} from 'genkit';

const GenerateSessionContentInputSchema = z.object({
  prompt: z.string().describe('The user-provided prompt to generate educational content from.'),
});
export type GenerateSessionContentInput = z.infer<typeof GenerateSessionContentInputSchema>;

const GenerateSessionContentOutputSchema = z.object({
  sessionContent: z.string().describe('The generated HTML content for the educational session.'),
  sessionTitle: z.string().describe('A suitable title for the generated content.'),
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
  // ✅ Corrected line: Use the model's string identifier
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are an expert curriculum designer. A teacher has provided the following prompt. Generate an HTML page with educational content based on it.
  Also generate a suitable title for the content based on the prompt.

Prompt: "{{{prompt}}}"

The HTML should be well-structured and styled for readability. Use <h1> for the main topic, <h2> for sub-sections, <p> for explanations, <ul> or <ol> with <li> for lists, and <strong> or <em> for emphasis.
Provide a clear and simple explanation of the topic suitable for a school student.
If the prompt asks for questions or a quiz, include them in a separate section.
`,
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