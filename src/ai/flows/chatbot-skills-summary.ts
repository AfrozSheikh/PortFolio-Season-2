'use server';

/**
 * @fileOverview Provides a Genkit flow to summarize a developer's skills for recruiters.
 *
 * - chatbotSkillsSummary - A function that generates a summary of skills relevant to job requirements.
 * - ChatbotSkillsSummaryInput - The input type for the chatbotSkillsSummary function.
 * - ChatbotSkillsSummaryOutput - The return type for the chatbotSkillsSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatbotSkillsSummaryInputSchema = z.object({
  jobRequirements: z
    .string()
    .describe('The specific job requirements or skills the recruiter is looking for.'),
  profileSummary: z
    .string()
    .describe('A summary of the developer profile, including key skills and experiences.'),
  skills: z.string().describe('A list of skills the developer possesses.'),
  projects: z.string().describe('A list of the developer projects.'),
});
export type ChatbotSkillsSummaryInput = z.infer<typeof ChatbotSkillsSummaryInputSchema>;

const ChatbotSkillsSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the developers skills and how they align with the provided job requirements.'
    ),
});
export type ChatbotSkillsSummaryOutput = z.infer<typeof ChatbotSkillsSummaryOutputSchema>;

export async function chatbotSkillsSummary(input: ChatbotSkillsSummaryInput): Promise<ChatbotSkillsSummaryOutput> {
  return chatbotSkillsSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotSkillsSummaryPrompt',
  input: {schema: ChatbotSkillsSummaryInputSchema},
  output: {schema: ChatbotSkillsSummaryOutputSchema},
  prompt: `You are an AI assistant inside the developer portfolio. Your goal is to help recruiters quickly assess a developer's suitability for a role.

  You will receive:
  - A summary of the developer's profile, skills and projects
  - The specific job requirements from the recruiter

  Based on this information, create a concise summary of the developer's skills and how they align with the provided job requirements.

  Developer Profile Summary: {{{profileSummary}}}
  Developer Skills: {{{skills}}}
  Developer Projects: {{{projects}}}
  Job Requirements: {{{jobRequirements}}}
  `,
});

const chatbotSkillsSummaryFlow = ai.defineFlow(
  {
    name: 'chatbotSkillsSummaryFlow',
    inputSchema: ChatbotSkillsSummaryInputSchema,
    outputSchema: ChatbotSkillsSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
