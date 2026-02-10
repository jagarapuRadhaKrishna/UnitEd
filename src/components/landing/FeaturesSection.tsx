import React from 'react';
import {
  User, Brain, Users, MessageCircle, Target,
  Calendar, Bell, Mail, Star, Filter, BarChart, Briefcase
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  { icon: User, title: 'Smart Profiles', description: 'Comprehensive profiles with skills, projects, achievements, and resume integration.', colorClass: 'text-primary bg-primary/10' },
  { icon: Brain, title: 'AI-Powered Matching', description: 'Advanced ML algorithms match you with perfect team members and opportunities.', colorClass: 'text-united-orange bg-united-orange/10' },
  { icon: Users, title: 'Team Formation', description: 'Create diverse teams with complementary skills. Multi-step posting and smart recommendations.', colorClass: 'text-united-green bg-united-green/10' },
  { icon: MessageCircle, title: 'Real-time Chat', description: 'Group chats, channels, and direct messaging with file sharing and threading.', colorClass: 'text-accent bg-accent/10' },
  { icon: Target, title: 'Personalized Feed', description: 'AI-curated feed showing opportunities that match your profile.', colorClass: 'text-pink-500 bg-pink-500/10' },
  { icon: Calendar, title: 'Events & Forums', description: 'Stay updated with academic events, workshops, and hackathons.', colorClass: 'text-accent bg-accent/10' },
  { icon: Bell, title: 'Smart Notifications', description: 'Real-time alerts for applications, team invitations, and messages.', colorClass: 'text-destructive bg-destructive/10' },
  { icon: Mail, title: 'Email Integration', description: 'Automated email notifications for applications and team updates.', colorClass: 'text-primary bg-primary/10' },
  { icon: BarChart, title: 'Analytics Dashboard', description: 'Track your application success rate, skill demand, and engagement metrics.', colorClass: 'text-united-green bg-united-green/10' },
  { icon: Filter, title: 'Advanced Search', description: 'Filter opportunities by skills, department, project type, and more.', colorClass: 'text-indigo-500 bg-indigo-500/10' },
  { icon: Briefcase, title: 'Project Management', description: 'Manage active projects, track team members, and handle applications.', colorClass: 'text-teal-500 bg-teal-500/10' },
  { icon: Star, title: 'Recommendations', description: 'Get personalized suggestions for team members and projects to join.', colorClass: 'text-united-amber bg-united-amber/10' },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-primary/5">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-foreground mb-4">
          Powerful Features for Academic Success
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-[700px] mx-auto text-lg">
          A comprehensive platform with powerful features designed to revolutionize academic collaboration
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const [textColor, bgColor] = feature.colorClass.split(' ');
            return (
              <Card
                key={index}
                className="h-full rounded-xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-5 ${bgColor}`}>
                    <Icon size={28} className={textColor} strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;