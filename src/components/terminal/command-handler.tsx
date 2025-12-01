'use client';

import * as React from 'react';
import {
  type HistoryItem,
  type Profile,
  type Skill,
  type Project,
  type Experience,
  type Education,
  type Achievement,
  type Link,
} from '@/lib/types';
import {
  HelpMessage,
  AboutOutput,
  SkillsOutput,
  ProjectsOutput,
  ProjectDetailOutput,
  ExperienceOutput,
  EducationOutput,
  AchievementsOutput,
  LinksOutput,
  ContactOutput,
  ThemeOutput
} from './outputs';

interface CommandHandlerProps {
  command: string;
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  setTheme: (theme: string) => void;
  setShowChat: (show: boolean) => void;
  onCommand: (cmd: string) => void;
  data: {
    profile: Profile;
    skills: Skill[];
    projects: Project[];
    experience: Experience[];
    education: Education[];
    achievements: Achievement[];
    links: Link[];
  };
}

const commandsList: { [key: string]: string } = {
  help: 'Show this help message.',
  about: 'Display summary about me.',
  skills: 'List my technical skills.',
  projects: 'Show my projects. Use --featured or <slug>.',
  experience: 'Display my work experience.',
  education: 'Show my education background.',
  achievements: 'List my notable achievements.',
  links: 'Get my social and professional links.',
  contact: 'Show how to contact me.',
  theme: 'Change the theme. Use "dark" or "light".',
  chat: 'Open the AI chat assistant.',
  clear: 'Clear the terminal screen.',
  whois: 'Alias for the "about" command.',
  repo: 'Opens the GitHub repository for this portfolio.',
  email: 'Display my email address.',
  resume: 'Get a link to my resume (placeholder).',
};


export const handleCommand = ({ command, setHistory, setTheme, setShowChat, onCommand, data }: CommandHandlerProps): React.ReactNode => {
  const [cmd, ...args] = command.toLowerCase().trim().split(' ');

  switch (cmd) {
    case 'help':
      return <HelpMessage commands={commandsList} args={args} onCommand={onCommand} />;
    
    case 'about':
    case 'bio':
    case 'whois':
      return <AboutOutput profile={data.profile} />;

    case 'skills':
      return <SkillsOutput skills={data.skills} />;

    case 'projects':
      const projectSlug = args[0] === '--featured' || args[0] === '--all' ? undefined : args[0];
      if (projectSlug) {
        const project = data.projects.find(p => p.slug === projectSlug);
        return project ? <ProjectDetailOutput project={project} /> : <div>Project &quot;{projectSlug}&quot; not found. Type `projects` to see all available projects.</div>;
      }
      return <ProjectsOutput projects={data.projects} filter={args[0] as '--featured' | '--all' | undefined} onCommand={onCommand} />;

    case 'project':
        if(args[0]) {
            const project = data.projects.find(p => p.slug === args[0]);
            return project ? <ProjectDetailOutput project={project} /> : <div>Project &quot;{args[0]}&quot; not found. Type `projects` to see all available projects.</div>;
        }
        return <div>Please specify a project slug. Type `projects` to see all available projects.</div>;

    case 'experience':
      return <ExperienceOutput experience={data.experience} />;

    case 'education':
      return <EducationOutput education={data.education} />;
    
    case 'achievements':
      return <AchievementsOutput achievements={data.achievements} />;

    case 'links':
    case 'social':
        return <LinksOutput links={data.links} />;
    
    case 'contact':
        return <ContactOutput profile={data.profile} links={data.links} />;
    
    case 'email':
        const emailLink = data.links.find(l => l.type === 'email');
        return <div>{emailLink ? emailLink.url.replace('mailto:', '') : 'Email not found.'}</div>;
    
    case 'repo':
        window.open('https://github.com/afroz-sh/terminal-portfolio', '_blank');
        return <div>Opening GitHub repository...</div>;
        
    case 'resume':
        // Placeholder for resume link
        window.open('/resume.pdf', '_blank');
        return <div>Opening resume... (Note: This is a placeholder link)</div>;

    case 'theme':
        const newTheme = args[0];
        if (newTheme === 'dark' || newTheme === 'light') {
            setTheme(newTheme);
            return <ThemeOutput theme={newTheme} />;
        }
        return <div>Invalid theme. Please use `theme dark` or `theme light`.</div>;

    case 'chat':
      setShowChat(true);
      return <div>Opening AI chat assistant...</div>;

    case 'clear':
      setHistory([]);
      return null;
      
    case '':
      return null;

    default:
      return <div>Command not found: &quot;{cmd}&quot;. Type `help` for a list of commands.</div>;
  }
};
