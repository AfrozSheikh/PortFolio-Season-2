export interface Profile {
  name: string;
  title: string;
  location: string;
  shortBio: string;
  longBio: string;
  avatarUrl: string;
  availabilityStatus: string;
}

export interface Link {
  type: 'email' | 'github' | 'linkedin' | 'portfolio' | string;
  label: string;
  url: string;
}

export interface Skill {
  category: string;
  items: {
    name: string;
    level?: number;
    notes?: string;
  }[];
}

export interface Project {
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  techStack: string[];
  role: string;
  highlights: string[];
  githubUrl?: string;
  liveUrl?: string;
  isFeatured: boolean;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  responsibilities: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  description?: string;
}

export interface Achievement {
  title: string;
  description: string;
  link?: string;
}

export interface HistoryItem {
  id: number;
  input: string;
  output: React.ReactNode;
}
