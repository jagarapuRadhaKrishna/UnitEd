export interface DeveloperProfile {
  id: string;
  name: string;
  role: string;
  avatar_url?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export const DEVELOPERS: DeveloperProfile[] = [
  {
    id: 'krishna',
    name: 'Krishna',
    role: 'Data Engineer',
    avatar_url: '',
    linkedin: '',
    github: '',
    portfolio: '',
  },
];
