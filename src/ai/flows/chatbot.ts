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

    const prompt = `You are a helpful AI assistant embedded in the portfolio of a developer named ${profile.name}.
Your goal is to answer questions from visitors, like recruiters or hiring managers.
Be friendly, concise, and professional.

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

    const {stream, response} = await ai.generateStream({
        prompt: prompt,
        history: input.history,
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
