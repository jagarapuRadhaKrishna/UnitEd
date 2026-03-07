export interface DeveloperProfile {
  id: string;
  name: string;
  role: string;
  email?: string;
  avatar_url?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  about_preview?: string;
  about_paragraphs?: string[];
}

export const DEVELOPERS: DeveloperProfile[] = [
  {
    id: 'krishna',
    name: 'JAGARAPU RADHA KRISHNA',
    role: 'BACKEND AND FULL STACK DEVELOPER',
    email: 'jagarapuradhakrishna.work@gmail.com',
    avatar_url: '/image/krishna.png',
    linkedin: 'https://www.linkedin.com/in/jagarapuradhakrishna/',
    github: 'https://github.com/jagarapuRadhaKrishna',
    portfolio: 'https://jrk-portfolio.netlify.app/',
    about_preview:
      'Hi, I’m Jagarapu Radha Krishna, a Backend and Full Stack Developer with a strong focus on building scalable, efficient, and user-friendly web applications. My primary interest lies in designing reliable backend systems and developing full-stack platforms that solve real-world problems. I work with modern technologies such as React.js, Next.js, Node.js, Express.js, PostgreSQL, and MongoDB to build dynamic and high-performance applications.',
    about_paragraphs: [
      'Hi, I’m Jagarapu Radha Krishna, a Backend and Full Stack Developer with a strong focus on building scalable, efficient, and user-friendly web applications. My primary interest lies in designing reliable backend systems and developing full-stack platforms that solve real-world problems.',
      'I work with modern technologies such as React.js, Next.js, Node.js, Express.js, PostgreSQL, and MongoDB to build dynamic and high-performance applications. My experience includes REST API development, authentication systems, database design, and backend architecture, ensuring applications are secure, fast, and scalable.',
      'I also work with modern tools and technologies such as Redis for caching, Docker for containerization, CI/CD pipelines for automated deployment, and cloud platforms like AWS to deploy and maintain production-ready applications.',
      'Along with my development work, I also take on freelance projects, providing services in web development, backend API development, database systems, and custom software solutions. I enjoy helping individuals and organizations transform their ideas into reliable digital platforms.',
      'This platform was developed as part of a college project to improve project collaboration between students and faculty. The goal is to create a structured environment where users can discover projects, connect with team members, and collaborate more effectively.',
      'Through projects like this, I continue to strengthen my skills in full-stack development, system design, and building scalable applications that deliver real value to users.',
    ],
  },
];
