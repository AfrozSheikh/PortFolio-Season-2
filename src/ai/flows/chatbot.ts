'use server';

/**
 * @fileOverview A general-purpose chatbot flow for the portfolio.
 *
 * - portfolioChat - A streaming flow that answers questions about the developer's profile.
 * - PortfolioChatInput - The input type for the portfolioChat function.
 */

import {ai} from '@/ai/genkit';
import {generate} from 'genkit/generate';
import {z} from 'genkit';
import { profile, skills, projects, experience, links } from '@/lib/data';

// Tool imports
import { chatbotSkillsSummary } from './chatbot-skills-summary';
import { chatbotWhyHire } from './chatbot-why-hire';
import { getProjectExplanation } from './chatbot-project-explanation';

const PortfolioChatInputSchema = z.object({
    history: z.array(z.object({
        role: z.enum(['user', 'model']),
        content: z.array(z.object({ text: z.string() })),
    })).optional(),
    message: z.string().describe('The user\'s message.'),
});

export type PortfolioChatInput = z.infer<typeof PortfolioChatInputSchema>;

export async function portfolioChat(input: PortfolioChatInput) {
    const topProjects = projects.filter(p => p.isFeatured).map(p => p.name).join(', ');
    const experienceSummary = experience.map(e => `${e.role} at ${e.company}`).join('; ');
    const skillsSummary = skills.map(s => `${s.category}: ${s.items.map(i => i.name).join(', ')}`).join('\n');
    const projectsSummary = projects.map(p => `${p.name}: ${p.shortDescription}`).join('\n');
    const linksSummary = links.map(l => `${l.label}: ${l.url}`).join(', ');

    const prompt = `You are a helpful and friendly AI assistant embedded in the portfolio of a developer named ${profile.name}.
Your goal is to answer questions from visitors, like recruiters or hiring managers.
Be friendly, concise, and professional. You have access to tools to answer specific questions about skills, projects, and why someone should hire ${profile.name}.
Use your tools when the user's query matches their purpose. For general conversation, you can answer directly.

Use the following context about ${profile.name} to answer questions. Do not make up information. If you don't know the answer, say you don't know.

## PROFILE SUMMARY
${profile.longBio}

## AVAILABILITY
${profile.availabilityStatus}

## SKILLS
${skillsSummary}

## TOP PROJECTS
${topProjects}

## ALL PROJECTS
${projectsSummary}

## PROFESSIONAL EXPERIENCE
${experienceSummary}

## CONTACT & SOCIAL LINKS
${linksSummary}

The user is asking: "${input.message}"
`;
    // Pass the user's profile data to the tool inputs
    const skillsTool = ai.defineTool({
      name: 'chatbotSkillsSummary',
      description: 'Use this tool when a recruiter asks how the candidate\'s skills match a job description or specific requirements.',
      inputSchema: z.object({ jobRequirements: z.string() }),
      outputSchema: z.any(),
    }, async (input) => chatbotSkillsSummary({ ...input, profileSummary: profile.longBio, skills: skillsSummary, projects: projectsSummary }));

    const whyHireTool = ai.defineTool({
        name: 'chatbotWhyHire',
        description: 'Use this tool when the user asks "Why should we hire you?" or a similar question about the candidate\'s suitability for a role.',
        inputSchema: z.object({}),
        outputSchema: z.any(),
    }, async () => chatbotWhyHire({ profileSummary: profile.longBio, skills: skillsSummary, topProjects: topProjects, experience: experienceSummary, links: linksSummary }));

    const projectExplanationTool = ai.defineTool({
        name: 'getProjectExplanation',
        description: 'Use this tool when the user asks for a detailed explanation of a specific project. You must provide the project name.',
        inputSchema: z.object({ projectName: z.string() }),
        outputSchema: z.any(),
    }, async ({ projectName }) => {
        const project = projects.find(p => p.name.toLowerCase() === projectName.toLowerCase() || p.slug.toLowerCase() === projectName.toLowerCase());
        if (!project) return { explanation: `I couldn't find a project named "${projectName}". You can ask for a list of projects.` };
        return getProjectExplanation({
            projectName: project.name,
            projectDescription: project.longDescription,
            projectTechStack: project.techStack,
            projectHighlights: project.highlights,
        });
    });


    const {stream, response} = await ai.generateStream({
        prompt: prompt,
        history: input.history,
        tools: [skillsTool, whyHireTool, projectExplanationTool]
    });
    
    // Convert the stream to a Node.js ReadableStream
    const nodeStream = new ReadableStream({
        async start(controller) {
            for await (const chunk of stream) {
                const text = chunk.text;
                if (text) {
                    controller.enqueue(text);
                }
            }
            controller.close();
        }
    });

    return nodeStream;
}
