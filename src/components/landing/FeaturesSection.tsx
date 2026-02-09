import React from 'react';
import {
  User, Brain, Users, MessageCircle, Target,
  Calendar, Bell, Mail, Star, Filter, BarChart, Briefcase
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  { icon: User, title: 'Smart Profiles', description: 'Comprehensive profiles with skills, projects, achievements, and resume integration.', color: '#2563EB' },
  { icon: Brain, title: 'AI-Powered Matching', description: 'Advanced ML algorithms match you with perfect team members and opportunities.', color: '#F97316' },
  { icon: Users, title: 'Team Formation', description: 'Create diverse teams with complementary skills. Multi-step posting and smart recommendations.', color: '#10B981' },
  { icon: MessageCircle, title: 'Real-time Chat', description: 'Group chats, channels, and direct messaging with file sharing and threading.', color: '#8B5CF6' },
  { icon: Target, title: 'Personalized Feed', description: 'AI-curated feed showing opportunities that match your profile.', color: '#EC4899' },
  { icon: Calendar, title: 'Events & Forums', description: 'Stay updated with academic events, workshops, and hackathons.', color: '#8B5CF6' },
  { icon: Bell, title: 'Smart Notifications', description: 'Real-time alerts for applications, team invitations, and messages.', color: '#EF4444' },
  { icon: Mail, title: 'Email Integration', description: 'Automated email notifications for applications and team updates.', color: '#3B82F6' },
  { icon: BarChart, title: 'Analytics Dashboard', description: 'Track your application success rate, skill demand, and engagement metrics.', color: '#10B981' },
  { icon: Filter, title: 'Advanced Search', description: 'Filter opportunities by skills, department, project type, and more.', color: '#6366F1' },
  { icon: Briefcase, title: 'Project Management', description: 'Manage active projects, track team members, and handle applications.', color: '#14B8A6' },
  { icon: Star, title: 'Recommendations', description: 'Get personalized suggestions for team members and projects to join.', color: '#F59E0B' },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: '#EFF6FF' }}>
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Powerful Features for Academic Success
        </h2>
        <p className="text-gray-500 text-center mb-12 max-w-[700px] mx-auto text-lg">
          A comprehensive platform with powerful features designed to revolutionize academic collaboration
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="h-full rounded-xl border border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                style={{ ['--hover-color' as any]: feature.color }}
              >
                <CardContent className="p-6">
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center mb-5"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <Icon size={28} color={feature.color} strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
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
