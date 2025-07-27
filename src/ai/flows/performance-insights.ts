// src/ai/flows/session-content-generation.ts

'use server';

import {ai} from '@/ai/genkit';
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
  // We are still removing the output schema to avoid the Handlebars error
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are an expert curriculum designer. A teacher has provided the following prompt.
Generate educational content and a suitable title based on the prompt.

Prompt: "{{{prompt}}}"

You MUST return your response as a single, valid JSON object with two keys: "sessionTitle" (a string) and "sessionContent" (a string containing the generated HTML).

The HTML in "sessionContent" should be well-structured and styled for readability. Use <h1> for the main topic, <h2> for sub-sections, <p> for explanations, <ul> or <ol> with <li> for lists, and <strong> or <em> for emphasis.
Provide a clear and simple explanation of the topic suitable for a school student.
If the prompt asks for questions or a quiz, include them in a separate section within the HTML.
`,
});

const sessionContentGenerationFlow = ai.defineFlow(
  {
    name: 'sessionContentGenerationFlow',
    inputSchema: GenerateSessionContentInputSchema,
    outputSchema: GenerateSessionContentOutputSchema,
  },
  async input => {
    // ✅ This is the corrected section
    // Call the prompt directly as a function
    const response = await sessionContentGenerationPrompt(input);

    // Get the raw text from the model's response
    const llmResponseText = response.text;

    // Clean up potential markdown code fences (e.g., ```json ... ```)
    const cleanedJson = llmResponseText.replace(/```json\n?/g, '').replace(/\n?```/g, '').trim();

    // Parse the cleaned text to a JSON object
    const parsedOutput = JSON.parse(cleanedJson);

    // Validate the parsed object against our output schema
    return GenerateSessionContentOutputSchema.parse(parsedOutput);
  }
);