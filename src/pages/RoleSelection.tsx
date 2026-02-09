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
    color: '#2563EB', path: '/register/student',
  },
  {
    type: 'faculty', icon: Briefcase, title: 'I am Faculty',
    description: 'Post opportunities, find talented students, and manage research teams',
    features: ['Post opportunities', 'Review applications', 'Manage teams', 'Track progress'],
    color: '#F97316', path: '/register/faculty',
  },
];

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center py-16" style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #FEF3C7 100%)' }}>
      <div className="max-w-3xl mx-auto px-4 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Join <span className="text-united-blue">UnitEd</span>
          </h1>
          <p className="text-lg text-gray-500">Select your role to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.type}
                className="h-full rounded-2xl border-2 border-transparent cursor-pointer transition-all duration-300 hover:-translate-y-2"
                style={{ ['--hover-border' as any]: role.color }}
                onClick={() => navigate(role.path)}
              >
                <CardContent className="p-8">
                  <div className="w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${role.color}15` }}>
                    <Icon size={40} color={role.color} strokeWidth={2} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 text-center mb-3">{role.title}</h2>
                  <p className="text-gray-500 text-center text-sm leading-relaxed mb-6">{role.description}</p>

                  <div className="mb-6 space-y-2">
                    {role.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: role.color }} />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full py-5 font-semibold" style={{ backgroundColor: role.color }} onClick={() => navigate(role.path)}>
                    Continue as {role.type === 'student' ? 'Student' : 'Faculty'} <ArrowRight className="ml-2" size={20} />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-united-blue font-semibold hover:underline">Login here</button>
        </p>
      </div>
    </div>
  );
};

export default RoleSelection;
