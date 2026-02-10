import React from 'react';
import { UserPlus, Search, Send, Users } from 'lucide-react';

const steps = [
  { icon: UserPlus, title: 'Create Your Profile', description: 'Sign up and build a comprehensive profile with your skills, projects, and interests.', number: '01' },
  { icon: Search, title: 'Discover Opportunities', description: 'Browse AI-recommended opportunities or post your own project needs.', number: '02' },
  { icon: Send, title: 'Apply & Connect', description: 'Submit skill-specific applications and wait for approval from opportunity creators.', number: '03' },
  { icon: Users, title: 'Collaborate', description: 'Join team chatrooms to communicate, share files, and work together on projects.', number: '04' },
];

const WorkflowSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-primary/10">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-foreground mb-4">How It Works</h2>
        <p className="text-muted-foreground text-center mb-16 max-w-[600px] mx-auto text-lg">
          Four simple steps to start collaborating on amazing projects
        </p>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-[60px] left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary via-united-orange to-united-green" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center relative">
                  {/* Icon Circle */}
                  <div className="w-[120px] h-[120px] rounded-full bg-card border-[3px] border-primary flex items-center justify-center mx-auto mb-6 relative transition-all duration-300 hover:scale-110 hover:rotate-[5deg] hover:shadow-xl">
                    <Icon size={40} className="text-primary" strokeWidth={2} />
                    {/* Step Number */}
                    <div className="absolute -top-2.5 -right-2.5 w-10 h-10 rounded-full bg-united-orange text-primary-foreground flex items-center justify-center font-bold text-sm shadow-lg">
                      {step.number}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed px-4">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;