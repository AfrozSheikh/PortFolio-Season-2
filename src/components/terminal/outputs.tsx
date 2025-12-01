'use client';

import {
  type Profile,
  type Skill,
  type Project,
  type Experience,
  type Education,
  type Achievement,
  type Link,
} from '@/lib/types';
import { Badge } from '../ui/badge';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OutputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="font-code text-sm leading-relaxed">{children}</div>
);

const Title = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-headline text-primary uppercase tracking-widest font-bold text-base mb-2">{children}</h2>
);

const Divider = () => <div className="w-full border-t border-dashed border-border my-3"></div>;

export const WelcomeMessage = () => (
  <OutputContainer>
    <pre className="font-code text-primary text-xs md:text-sm whitespace-pre-wrap">
      {`
      ██████╗ ███████╗██╗   ██╗     ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ ██╗  ██████╗ ██╗     
      ██╔══██╗██╔════╝╚██╗ ██╔╝     ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║███║ ██╔═══██╗██║     
      ██║  ██║█████╗   ╚████╔╝         ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║╚██║ ██║   ██║██║     
      ██║  ██║██╔══╝    ╚██╔╝          ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║ ██║ ██║   ██║██║     
      ██████╔╝███████╗   ██║           ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║ ██║ ╚██████╔╝███████╗
      ╚═════╝ ╚══════╝   ╚═╝           ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝ ╚═╝  ╚═════╝ ╚══════╝
                                                                                                    
      `}
    </pre>
    <div>Welcome to the interactive portfolio of Afroz Sheikh.</div>
    <div className="mt-2">Type <span className="text-primary font-bold">`help`</span> to see the list of available commands.</div>
    <div className="mt-1">Or, switch to the <span className="text-primary font-bold">`AI Chat`</span> to talk to my AI assistant.</div>
  </OutputContainer>
);

export const HelpMessage = ({ commands, args, onCommand }: { commands: { [key: string]: string }, args: string[], onCommand: (cmd: string) => void }) => {
    if (args[0] && commands[args[0]]) {
        return (
            <OutputContainer>
                <div>
                    <span className="text-primary font-bold">{args[0]}</span> - {commands[args[0]]}
                </div>
            </OutputContainer>
        );
    }
    
  return (
    <OutputContainer>
      <Title>Available Commands</Title>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1">
        {Object.entries(commands).map(([command, description]) => (
          <li key={command} className="flex items-start">
            <Button
                variant="link"
                className="text-primary font-bold w-24 inline-block p-0 h-auto text-left justify-start"
                onClick={() => onCommand(`help ${command}`)}
            >
                {command}
            </Button>
            <span className="text-muted-foreground">{description}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-muted-foreground">
        Pro-tip: use <span className="text-primary font-bold">`--featured`</span> with `projects`, or use a project <span className="text-primary font-bold">slug</span> to see details.
      </div>
    </OutputContainer>
  );
};

export const AboutOutput = ({ profile }: { profile: Profile }) => (
  <OutputContainer>
    <Title>About Me</Title>
    <p>{profile.longBio}</p>
    <div className='mt-2'>
        Currently <span className="text-primary">{profile.availabilityStatus}</span>
    </div>
  </OutputContainer>
);

export const SkillsOutput = ({ skills }: { skills: Skill[] }) => (
  <OutputContainer>
    <Title>Technical Skills</Title>
    <div className="space-y-4">
        {skills.map((category) => (
            <div key={category.category}>
                <h3 className="font-bold font-headline text-foreground">{category.category}</h3>
                <Divider />
                <ul className="flex flex-wrap gap-2 mt-2">
                    {category.items.map((item) => (
                        <li key={item.name}>
                           <Badge variant="secondary" className="text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">{item.name}</Badge>
                        </li>
                    ))}
                </ul>
            </div>
        ))}
    </div>
  </OutputContainer>
);

export const ProjectsOutput = ({ projects, filter, onCommand }: { projects: Project[], filter?: '--featured' | '--all', onCommand: (cmd: string) => void }) => {
    const projectsToShow = filter === '--featured' ? projects.filter(p => p.isFeatured) : projects;

    return (
        <OutputContainer>
            <Title>{filter === '--featured' ? 'Featured Projects' : 'All Projects'}</Title>
            <div className="space-y-3">
            {projectsToShow.map(p => (
                <div key={p.slug}>
                    <div className="flex items-baseline">
                        <Button
                            variant="link"
                            className="text-foreground font-bold p-0 h-auto mr-2"
                            onClick={() => onCommand(`project ${p.slug}`)}
                        >
                            {p.name}
                        </Button>
                         <span className='text-primary/70 text-xs'>({p.slug})</span>
                        {p.isFeatured && <Star className="h-3 w-3 text-yellow-400 ml-2" />}
                    </div>
                    <p className="text-muted-foreground ml-1">{p.shortDescription}</p>
                    <div className="flex flex-wrap gap-2 mt-1 ml-1">
                        {p.techStack.slice(0, 5).map(t => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                    </div>
                </div>
            ))}
            </div>
            <div className='text-muted-foreground mt-4'>
                To see details, type <span className='text-primary'>`project &lt;slug&gt;`</span> or click a project name.
            </div>
        </OutputContainer>
    );
}

export const ProjectDetailOutput = ({ project }: { project: Project }) => (
    <OutputContainer>
        <div className="flex items-center gap-2 mb-2">
            <Title>{project.name}</Title>
            {project.isFeatured && <Badge className="bg-yellow-400/20 text-yellow-300 border-yellow-400/30"><Star className="h-3 w-3 mr-1"/>Featured</Badge>}
        </div>
        <p className="mb-3">{project.longDescription}</p>
        
        <h3 className="font-bold text-foreground mb-1">Tech Stack:</h3>
        <div className="flex flex-wrap gap-2 mb-3">
            {project.techStack.map(t => <Badge key={t} variant="secondary" className="text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">{t}</Badge>)}
        </div>

        <h3 className="font-bold text-foreground mb-1">Highlights:</h3>
        <ul className="list-disc list-inside space-y-1 mb-3 text-muted-foreground">
            {project.highlights.map(h => <li key={h}>{h}</li>)}
        </ul>

        {(project.githubUrl || project.liveUrl) && (
            <>
                <h3 className="font-bold text-foreground mb-1">Links:</h3>
                <div className='flex items-center gap-4'>
                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">GitHub <ArrowRight className="h-3 w-3" /></a>}
                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">Live Demo <ArrowRight className="h-3 w-3" /></a>}
                </div>
            </>
        )}

    </OutputContainer>
);

export const ExperienceOutput = ({ experience }: { experience: Experience[] }) => (
    <OutputContainer>
        <Title>Work Experience</Title>
        <div className="relative space-y-6 before:absolute before:left-[5px] before:top-2 before:h-full before:w-[2px] before:bg-border">
            {experience.map(exp => (
                <div key={exp.company} className="relative pl-6">
                    <div className="absolute left-0 top-2.5 h-3 w-3 rounded-full bg-primary"></div>
                    <div className="font-bold text-foreground">{exp.role} @ {exp.company}</div>
                    <div className="text-xs text-muted-foreground">{exp.period} &bull; {exp.location}</div>
                    <p className="text-sm mt-1">{exp.description}</p>
                    <ul className="list-disc list-inside text-sm mt-1 text-muted-foreground/80">
                        {exp.responsibilities.map(r => <li key={r}>{r}</li>)}
                    </ul>
                </div>
            ))}
        </div>
    </OutputContainer>
);

export const EducationOutput = ({ education }: { education: Education[] }) => (
    <OutputContainer>
        <Title>Education</Title>
        <div className="space-y-4">
        {education.map(edu => (
            <div key={edu.institution}>
                <div className="font-bold text-foreground">{edu.degree}</div>
                <div className="text-muted-foreground">{edu.institution}</div>
                <div className="text-xs text-muted-foreground/80">{edu.period}</div>
                {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
            </div>
        ))}
        </div>
    </OutputContainer>
);

export const AchievementsOutput = ({ achievements }: { achievements: Achievement[] }) => (
    <OutputContainer>
        <Title>Achievements</Title>
        <ul className="space-y-2">
            {achievements.map(ach => (
                <li key={ach.title} className="flex items-start">
                    <span className="text-primary mr-2">&#9679;</span>
                    <div>
                        <span className="font-bold text-foreground">{ach.title}: </span>
                        <span className="text-muted-foreground">{ach.description}</span>
                        {ach.link && <a href={ach.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-2 text-xs">[view]</a>}
                    </div>
                </li>
            ))}
        </ul>
    </OutputContainer>
);

export const LinksOutput = ({ links }: { links: Link[] }) => (
    <OutputContainer>
        <Title>Links & Socials</Title>
        <ul className="space-y-1">
            {links.map(link => (
                <li key={link.type}>
                    <span className="font-bold capitalize w-20 inline-block">{link.label}:</span>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{link.url.replace('mailto:', '')}</a>
                </li>
            ))}
        </ul>
    </OutputContainer>
);

export const ContactOutput = ({ profile, links }: { profile: Profile, links: Link[] }) => {
    const emailLink = links.find(l => l.type === 'email');
    return (
        <OutputContainer>
            <Title>Contact Me</Title>
            <p className="mb-2">Feel free to reach out. I&apos;m open to new opportunities and collaborations.</p>
            {emailLink && <div><span className='font-bold w-16 inline-block'>Email:</span> <a href={emailLink.url} className='text-primary hover:underline'>{emailLink.url.replace('mailto:', '')}</a></div>}
            <div><span className='font-bold w-16 inline-block'>Based in:</span> {profile.location}</div>
            <div className='mt-3'><LinksOutput links={links.filter(l => l.type !== 'email')} /></div>
        </OutputContainer>
    );
}

export const ThemeOutput = ({ theme }: { theme: string }) => (
    <OutputContainer>
        <div>Theme changed to <span className="capitalize text-primary font-bold">{theme}</span>.</div>
    </OutputContainer>
);
