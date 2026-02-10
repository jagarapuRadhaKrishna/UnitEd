import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Briefcase, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const roles = [
  {
    type: 'student', icon: GraduationCap, title: 'I am a Student',
    description: 'Find research opportunities, join projects, and collaborate with faculty and peers',
    features: ['Browse opportunities', 'Apply to projects', 'Join teams', 'Build your portfolio'],
    colorClass: 'text-primary bg-primary', path: '/register/student',
  },
  {
    type: 'faculty', icon: Briefcase, title: 'I am Faculty',
    description: 'Post opportunities, find talented students, and manage research teams',
    features: ['Post opportunities', 'Review applications', 'Manage teams', 'Track progress'],
    colorClass: 'text-united-orange bg-united-orange', path: '/register/faculty',
  },
];

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center py-16 bg-gradient-to-br from-blue-50 via-blue-100 to-amber-50">
      <div className="max-w-3xl mx-auto px-4 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Join <span className="text-primary">UnitEd</span>
          </h1>
          <p className="text-lg text-muted-foreground">Select your role to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            const isStudent = role.type === 'student';
            return (
              <Card
                key={role.type}
                className="h-full rounded-2xl border-2 border-transparent cursor-pointer transition-all duration-300 hover:-translate-y-2"
                onClick={() => navigate(role.path)}
              >
                <CardContent className="p-8">
                  <div className={`w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-6 ${isStudent ? 'bg-primary/10' : 'bg-united-orange/10'}`}>
                    <Icon size={40} className={isStudent ? 'text-primary' : 'text-united-orange'} strokeWidth={2} />
                  </div>
                  <h2 className="text-xl font-bold text-foreground text-center mb-3">{role.title}</h2>
                  <p className="text-muted-foreground text-center text-sm leading-relaxed mb-6">{role.description}</p>

                  <div className="mb-6 space-y-2">
                    {role.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${isStudent ? 'bg-primary' : 'bg-united-orange'}`} />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button className={`w-full py-5 font-semibold ${isStudent ? 'bg-primary hover:bg-primary/80' : 'bg-united-orange hover:bg-united-orange/80'}`} onClick={() => navigate(role.path)}>
                    Continue as {role.type === 'student' ? 'Student' : 'Faculty'} <ArrowRight className="ml-2" size={20} />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-primary font-semibold hover:underline">Login here</button>
        </p>
      </div>
    </div>
  );
};

export default RoleSelection;