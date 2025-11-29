
import { NextResponse } from 'next/server';
import { chatbotSkillsSummary } from '@/ai/flows/chatbot-skills-summary';
import { chatbotWhyHire } from '@/ai/flows/chatbot-why-hire';
import { getProjectExplanation } from '@/ai/flows/chatbot-project-explanation';
import { profile, skills, projects, experience, links } from '@/lib/data';

export async function POST(req: Request) {
  try {
    const { type, payload } = await req.json();

    switch (type) {
      case 'why-hire': {
        const topProjects = projects.filter(p => p.isFeatured).map(p => p.name).join(', ');
        const experienceSummary = experience.map(e => `${e.role} at ${e.company}`).join('; ');
        
        const response = await chatbotWhyHire({
          profileSummary: profile.longBio,
          skills: skills.map(s => `${s.category}: ${s.items.map(i => i.name).join(', ')}`).join('\n'),
          topProjects: topProjects,
          experience: experienceSummary,
          links: links.map(l => `${l.label}: ${l.url}`).join(', '),
        });
        return NextResponse.json(response);
      }

      case 'project-explanation': {
        const { projectSlug } = payload;
        const project = projects.find(p => p.slug === projectSlug);
        if (!project) {
          return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }
        const response = await getProjectExplanation({
            projectName: project.name,
            projectDescription: project.longDescription,
            projectTechStack: project.techStack,
            projectHighlights: project.highlights,
        });
        return NextResponse.json(response);
      }
      
      case 'skills-summary': {
        const { jobRequirements } = payload;
        if(!jobRequirements){
            return NextResponse.json({ error: 'Job requirements are empty' }, { status: 400 });
        }
        const response = await chatbotSkillsSummary({
            jobRequirements,
            profileSummary: profile.longBio,
            skills: skills.map(s => `${s.category}: ${s.items.map(i => i.name).join(', ')}`).join('\n'),
            projects: projects.map(p => `${p.name}: ${p.shortDescription}`).join('\n'),
        });
        return NextResponse.json(response);
      }
      
      case 'generic-chat': {
        const { message, history } = payload;
         const topProjects = projects.filter(p => p.isFeatured).map(p => p.name).join(', ');
        const experienceSummary = experience.map(e => `${e.role} at ${e.company}`).join('; ');
        
        if (message.toLowerCase().includes('hire')) {
            const response = await chatbotWhyHire({
                profileSummary: profile.longBio,
                skills: skills.map(s => `${s.category}: ${s.items.map(i => i.name).join(', ')}`).join('\n'),
                topProjects: topProjects,
                experience: experienceSummary,
                links: links.map(l => `${l.label}: ${l.url}`).join(', '),
            });
            return NextResponse.json({answer: response.answer});
        }
        
        const projectMention = projects.find(p => message.toLowerCase().includes(p.name.toLowerCase()) || message.toLowerCase().includes(p.slug.toLowerCase()));
        if (projectMention) {
            const response = await getProjectExplanation({
                projectName: projectMention.name,
                projectDescription: projectMention.longDescription,
                projectTechStack: projectMention.techStack,
                projectHighlights: projectMention.highlights,
            });
            return NextResponse.json({answer: response.explanation});
        }

        const response = await chatbotSkillsSummary({
            jobRequirements: message,
            profileSummary: profile.longBio,
            skills: skills.map(s => `${s.category}: ${s.items.map(i => i.name).join(', ')}`).join('\n'),
            projects: projects.map(p => `${p.name}: ${p.shortDescription}`).join('\n'),
        });
        return NextResponse.json({answer: response.summary});
      }

      default:
        return NextResponse.json({ error: 'Invalid query type' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
