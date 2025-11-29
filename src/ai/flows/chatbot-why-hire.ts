'use server';

/**
 * @fileOverview An AI agent to answer the question "Why should we hire Afroz?".
 *
 * - chatbotWhyHire - A function that answers the question.
 * - ChatbotWhyHireInput - The input type for the chatbotWhyHire function.
 * - ChatbotWhyHireOutput - The return type for the chatbotWhyHire function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatbotWhyHireInputSchema = z.object({
  profileSummary: z.string().describe('A summary of Afroz Sheikhs profile.'),
  skills: z.string().describe('A list of Afroz Sheikhs skills.'),
  topProjects: z.string().describe('A list of Afroz Sheikhs top projects.'),
  experience: z.string().describe('A summary of Afroz Sheikhs experience.'),
  links: z.string().describe('A list of Afroz Sheikhs links (e.g. Github, LinkedIn).'),
});
export type ChatbotWhyHireInput = z.infer<typeof ChatbotWhyHireInputSchema>;

const ChatbotWhyHireOutputSchema = z.object({
  answer: z.string().describe('A concise and compelling answer highlighting Afroz Sheikhs key strengths and experiences.'),
});
export type ChatbotWhyHireOutput = z.infer<typeof ChatbotWhyHireOutputSchema>;

export async function chatbotWhyHire(input: ChatbotWhyHireInput): Promise<ChatbotWhyHireOutput> {
  return chatbotWhyHireFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotWhyHirePrompt',
  input: {schema: ChatbotWhyHireInputSchema},
  output: {schema: ChatbotWhyHireOutputSchema},
  prompt: `You are an AI assistant inside the developer portfolio of Afroz Sheikh. A hiring manager is asking "Why should we hire Afroz?" Provide a concise, compelling answer highlighting Afroz's key strengths and experiences. Use the following information about Afroz to formulate your response:\n\nProfile Summary: {{{profileSummary}}}\nSkills: {{{skills}}}\nTop Projects: {{{topProjects}}}\nExperience: {{{experience}}}\nLinks: {{{links}}}\n\nThe answer should be no more than 150 words.
`,
});

const chatbotWhyHireFlow = ai.defineFlow(
  {
    name: 'chatbotWhyHireFlow',
    inputSchema: ChatbotWhyHireInputSchema,
    outputSchema: ChatbotWhyHireOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
