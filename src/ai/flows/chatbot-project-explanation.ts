'use server';

/**
 * @fileOverview Provides detailed explanations of the developer's projects via a chatbot.
 *
 * - getProjectExplanation - A function that retrieves a detailed explanation of a project.
 * - ProjectExplanationInput - The input type for the getProjectExplanation function.
 * - ProjectExplanationOutput - The return type for the getProjectExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProjectExplanationInputSchema = z.object({
  projectName: z.string().describe('The name of the project to explain.'),
  projectDescription: z.string().describe('The description of the project.'),
  projectTechStack: z.array(z.string()).describe('The tech stack used in the project.'),
  projectHighlights: z.array(z.string()).describe('Key highlights or features of the project.'),
});
export type ProjectExplanationInput = z.infer<typeof ProjectExplanationInputSchema>;

const ProjectExplanationOutputSchema = z.object({
  explanation: z.string().describe('A detailed explanation of the project.'),
});
export type ProjectExplanationOutput = z.infer<typeof ProjectExplanationOutputSchema>;

export async function getProjectExplanation(input: ProjectExplanationInput): Promise<ProjectExplanationOutput> {
  return projectExplanationFlow(input);
}

const projectExplanationPrompt = ai.definePrompt({
  name: 'projectExplanationPrompt',
  input: {schema: ProjectExplanationInputSchema},
  output: {schema: ProjectExplanationOutputSchema},
  prompt: `You are an AI assistant inside a developer portfolio. Your task is to provide detailed explanations of the developer's projects.

  Project Name: {{projectName}}
  Description: {{projectDescription}}
  Tech Stack: {{#each projectTechStack}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Highlights: {{#each projectHighlights}}- {{{this}}}\n{{/each}}

  Based on the information above, provide a detailed explanation of the project, focusing on its purpose, the technologies used, and its key features. Be clear, friendly, and concise.
  `,
});

const projectExplanationFlow = ai.defineFlow(
  {
    name: 'projectExplanationFlow',
    inputSchema: ProjectExplanationInputSchema,
    outputSchema: ProjectExplanationOutputSchema,
  },
  async input => {
    const {output} = await projectExplanationPrompt(input);
    return output!;
  }
);
