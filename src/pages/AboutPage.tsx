import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, Target, Lightbulb, Award, BookOpen, MessageSquare, Briefcase, Zap } from 'lucide-react';

const features = [
  { icon: <Users className="w-5 h-5" />, title: 'Team Formation', desc: 'Find and connect with the right teammates based on skills and interests.' },
  { icon: <Target className="w-5 h-5" />, title: 'Skill Matching', desc: 'AI-powered recommendations match you with relevant opportunities.' },
  { icon: <MessageSquare className="w-5 h-5" />, title: 'Real-time Chat', desc: 'Collaborate seamlessly with project-specific chat rooms.' },
  { icon: <BookOpen className="w-5 h-5" />, title: 'Forums', desc: 'Engage in discussions, share knowledge, and learn from peers.' },
  { icon: <Briefcase className="w-5 h-5" />, title: 'Project Management', desc: 'Create, manage, and track your academic projects efficiently.' },
  { icon: <Award className="w-5 h-5" />, title: 'Portfolio Building', desc: 'Showcase your projects, skills, and achievements.' },
];

const team = [
  { name: 'Madhuri', role: 'Project Lead', avatar: 'M' },
  { name: 'Annanya', role: 'Frontend Developer', avatar: 'A' },
  { name: 'Vedhakshi', role: 'UI/UX Designer', avatar: 'V' },
  { name: 'Maaroof', role: 'Backend Developer', avatar: 'M' },
  { name: 'Krishna', role: 'Data Engineer', avatar: 'K' },
];

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">
          About Unit<span className="text-primary">Ed</span> 🫱🏻‍🫲🏾
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          UnitEd is an academic collaboration platform that brings students and faculty together to innovate, collaborate, and elevate their academic journey.
        </p>
      </div>

      {/* Mission */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-united-orange" />
            <h2 className="text-lg font-bold">Our Mission</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To bridge the gap between students seeking project opportunities and faculty/mentors looking for talented collaborators. We believe that the best innovations happen when diverse skills come together with shared purpose.
          </p>
        </CardContent>
      </Card>

      {/* Features */}
      <h2 className="text-xl font-bold mb-4">Platform Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {features.map(f => (
          <Card key={f.title}>
            <CardContent className="p-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">{f.icon}</div>
              <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team */}
      <h2 className="text-xl font-bold mb-4">Our Team</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {team.map(t => (
          <Card key={t.name}>
            <CardContent className="p-4 text-center">
              <div className="h-14 w-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg mb-2">{t.avatar}</div>
              <p className="font-semibold text-sm">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-4 text-center">Platform Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { label: 'Active Users', value: '500+' },
              { label: 'Projects Created', value: '150+' },
              { label: 'Collaborations', value: '300+' },
              { label: 'Success Rate', value: '85%' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-primary">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;
