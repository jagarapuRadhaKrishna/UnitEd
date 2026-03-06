import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import {
  Award,
  BookOpen,
  Briefcase,
  Lightbulb,
  MessageSquare,
  Target,
  Users,
  Workflow,
  Zap,
} from 'lucide-react';

const features = [
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Team Formation',
    desc: 'Find and connect with teammates based on skills and interests.',
  },
  {
    icon: <Target className="w-5 h-5" />,
    title: 'Skill Matching',
    desc: 'Get relevant opportunities using profile-based matching.',
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: 'Real-time Chat',
    desc: 'Collaborate seamlessly with project-specific chat rooms.',
  },
  {
    icon: <BookOpen className="w-5 h-5" />,
    title: 'Forums',
    desc: 'Discuss ideas, ask questions, and learn from peers.',
  },
  {
    icon: <Briefcase className="w-5 h-5" />,
    title: 'Project Management',
    desc: 'Create, track, and manage projects from one place.',
  },
  {
    icon: <Award className="w-5 h-5" />,
    title: 'Portfolio Building',
    desc: 'Showcase projects, outcomes, and achievements.',
  },
];

const techStack = [
  'React',
  'TypeScript',
  'Vite',
  'Tailwind CSS',
  'MUI',
  'Supabase',
  'Framer Motion',
];

const workflow = [
  'Create profile and add skills',
  'Explore or post opportunities',
  'Apply / invite / shortlist members',
  'Collaborate in chatrooms and forums',
  'Track progress and outcomes',
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
};

const featureCardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      delay: index * 0.06,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

const AboutApplicationPage: React.FC = () => {
  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.div variants={sectionVariants}>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-united-orange" />
              <h2 className="text-lg font-bold text-foreground">Purpose</h2>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              UnitEd helps students and faculty collaborate efficiently on research,
              projects, and hackathons through structured discovery, matching, and
              communication workflows.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={sectionVariants}>
        <h2 className="text-xl font-bold mb-3 text-foreground">Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div key={feature.title} variants={featureCardVariants} custom={index}>
              <Card className="transition-shadow duration-300 hover:shadow-md">
                <CardContent className="p-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-sm mb-1 text-foreground">{feature.title}</h3>
                  <p className="text-xs text-foreground/75">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={sectionVariants}>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-3 text-foreground">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>

            <Separator className="my-5" />

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2 text-foreground">
                <Workflow className="w-4 h-4" /> Workflow
              </h3>
              <ul className="space-y-1.5 text-sm text-foreground">
                {workflow.map((step, idx) => (
                  <li key={step} className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary font-semibold">{idx + 1}.</span>
                    <span className="text-foreground">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator className="my-5" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-foreground">
                <div>
                  <p className="text-xs text-foreground/70">Version</p>
                  <p className="font-semibold text-foreground">v1.0</p>
                </div>
                <div>
                  <p className="text-xs text-foreground/70">Status</p>
                  <p className="font-semibold inline-flex items-center gap-1 text-foreground">
                    <Zap className="w-4 h-4 text-united-orange" /> Active
                  </p>
                </div>
                <div>
                  <p className="text-xs text-foreground/70">Support</p>
                  <p className="font-semibold text-foreground">Through platform notifications</p>
                </div>
              </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AboutApplicationPage;
