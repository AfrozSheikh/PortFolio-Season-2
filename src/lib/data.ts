import type {
  Profile,
  Skill,
  Project,
  Experience,
  Education,
  Achievement,
  Link,
} from './types';

export const profile: Profile = {
  name: 'Afroz Sheikh',
  title: 'Full-Stack Developer',
  location: 'Mumbai, India',
  shortBio:
    'A passionate full-stack developer with a knack for building robust and scalable web applications.',
  longBio:
    'As a full-stack developer, I specialize in creating dynamic, high-performance web applications from concept to deployment. With strong expertise in the MERN stack and modern technologies like Next.js and TypeScript, I am dedicated to writing clean, efficient code and building user-centric solutions. I thrive in collaborative environments and am always eager to tackle new challenges and learn emerging technologies.',
  avatarUrl: 'https://picsum.photos/seed/afroz/200/200',
  availabilityStatus: 'Actively looking for new opportunities',
};

export const links: Link[] = [
  {
    type: 'email',
    label: 'Email',
    url: 'mailto:afroz@example.com',
  },
  {
    type: 'github',
    label: 'GitHub',
    url: 'https://github.com/afroz-sh',
  },
  {
    type: 'linkedin',
    label: 'LinkedIn',
    url: 'https://linkedin.com/in/afroz-sh',
  },
  {
    type: 'portfolio',
    label: 'Portfolio',
    url: 'https://afroz-portfolio.dev',
  },
];

export const skills: Skill[] = [
  {
    category: 'Frontend',
    items: [
      { name: 'React', level: 90 },
      { name: 'Next.js', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'JavaScript (ES6+)', level: 95 },
      { name: 'Tailwind CSS', level: 95 },
      { name: 'HTML5 & CSS3', level: 95 },
      { name: 'Redux', level: 80 },
    ],
  },
  {
    category: 'Backend',
    items: [
      { name: 'Node.js', level: 90 },
      { name: 'Express.js', level: 85 },
      { name: 'REST APIs', level: 95 },
      { name: 'GraphQL', level: 75 },
      { name: 'Firebase', level: 80 },
    ],
  },
  {
    category: 'Databases',
    items: [
      { name: 'MongoDB', level: 85 },
      { name: 'PostgreSQL', level: 70 },
      { name: 'Mongoose', level: 85 },
      { name: 'Prisma', level: 75 },
    ],
  },
  {
    category: 'Tools & DevOps',
    items: [
      { name: 'Git & GitHub', level: 95 },
      { name: 'Docker', level: 70 },
      { name: 'Vercel', level: 90 },
      { name: 'Webpack', level: 75 },
      { name: 'Jest & RTL', level: 80 },
    ],
  },
];

export const projects: Project[] = [
  {
    name: 'SaaS Web Monitoring Platform',
    slug: 'web-monitor-saas',
    shortDescription: 'An SDK and dashboard for real-time web performance and error tracking.',
    longDescription:
      'A comprehensive SaaS platform that provides developers with tools to monitor their web applications in real-time. It includes a lightweight SDK for data collection and a powerful dashboard for visualizing performance metrics, tracking errors, and setting up alerts.',
    techStack: [
      'Next.js',
      'TypeScript',
      'Node.js',
      'MongoDB',
      'Express',
      'Chart.js',
      'Tailwind CSS',
    ],
    role: 'Lead Full-Stack Developer',
    highlights: [
      'Developed a performant data ingestion pipeline with Node.js and Express.',
      'Built an interactive and real-time dashboard using Next.js and WebSockets.',
      'Designed a flexible database schema with MongoDB for time-series data.',
      'Implemented a lightweight client-side SDK to capture metrics with minimal overhead.',
    ],
    githubUrl: 'https://github.com/afroz-sh/web-monitor-saas',
    liveUrl: 'https://web-monitor.dev',
    isFeatured: true,
  },
  {
    name: 'E-commerce MERN App',
    slug: 'e-commerce-mern',
    shortDescription: 'A full-featured e-commerce store built with the MERN stack.',
    longDescription:
      'A complete e-commerce solution with features like product catalog, shopping cart, user authentication, order management, and payment integration. Built from the ground up to be scalable and secure.',
    techStack: ['MongoDB', 'Express', 'React', 'Node.js', 'Redux', 'Stripe API'],
    role: 'Full-Stack Developer',
    highlights: [
      'Implemented JWT-based authentication and authorization for users and admins.',
      'Integrated Stripe for secure payment processing.',
      'Developed a responsive and intuitive user interface with React and Redux.',
    ],
    githubUrl: 'https://github.com/afroz-sh/e-commerce-mern',
    isFeatured: true,
  },
  {
    name: 'Task Management Tool',
    slug: 'task-manager',
    shortDescription: 'A Kanban-style task management tool for teams.',
    longDescription:
      'A collaborative, real-time task management application inspired by Trello. Users can create boards, lists, and cards, assign tasks, and track progress with a drag-and-drop interface.',
    techStack: ['React', 'Firebase', 'Tailwind CSS', 'React-beautiful-dnd'],
    role: 'Frontend Developer (Freelance)',
    highlights: [
      'Built a real-time, collaborative UI using Firebase Realtime Database.',
      'Implemented a smooth drag-and-drop functionality for tasks and lists.',
      'Designed a clean and modern UI with Tailwind CSS.',
    ],
    githubUrl: 'https://github.com/afroz-sh/task-manager',
    isFeatured: false,
  },
  {
    name: 'Personal Portfolio v1',
    slug: 'portfolio-v1',
    shortDescription: 'My previous personal portfolio website.',
    longDescription:
      'My first iteration of a personal portfolio, built to showcase my projects and skills. It was a static site generated with Next.js, focused on clean design and performance.',
    techStack: ['Next.js', 'React', 'Styled-Components'],
    role: 'Developer',
    highlights: [
      'Focused on SEO and performance best practices.',
      'Designed and built from scratch.',
    ],
    githubUrl: 'https://github.com/afroz-sh/portfolio-v1',
    isFeatured: false,
  },
];

export const experience: Experience[] = [
  {
    company: 'Digital Innovations Inc.',
    role: 'Full-Stack Developer',
    period: 'Jan 2022 - Present',
    location: 'Mumbai, India (Remote)',
    description:
      'Contributed to various client projects, from large-scale enterprise applications to fast-paced startup MVPs, using modern web technologies.',
    responsibilities: [
      'Led the development of a Next.js-based CMS for a major media client.',
      'Collaborated with a team of 5 developers to build and maintain a complex SaaS application.',
      'Mentored junior developers and conducted code reviews to ensure code quality.',
      'Optimized application performance, achieving a 30% reduction in load times.',
    ],
  },
  {
    company: 'Tech Solutions Co.',
    role: 'Backend Intern',
    period: 'Jun 2021 - Dec 2021',
    location: 'Pune, India',
    description:
      'Worked with the backend team on developing and maintaining REST APIs for their flagship product.',
    responsibilities: [
      'Assisted in developing new API endpoints using Node.js and Express.',
      'Wrote unit and integration tests, increasing test coverage by 15%.',
      'Managed database schemas and queries in MongoDB.',
    ],
  },
];

export const education: Education[] = [
  {
    degree: 'Bachelor of Engineering in Computer Science',
    institution: 'University of Mumbai',
    period: '2018 - 2022',
    description: 'Graduated with First Class Honours. Focused on data structures, algorithms, and web development.',
  },
];

export const achievements: Achievement[] = [
  {
    title: 'Hackathon Winner',
    description: '1st place at the 2021 CodeFest Hackathon for building a prototype of a real-time-sync document editor.',
    link: 'https://devpost.com/afroz-sh/codefest-winner',
  },
  {
    title: 'LeetCode',
    description: 'Solved over 300+ problems, honing skills in algorithms and data structures.',
    link: 'https://leetcode.com/afroz-sh/',
  },
  {
    title: 'Open Source Contributor',
    description: 'Contributed to several open-source projects, including documentation and bug fixes for a popular UI library.',
  },
];
