import React from 'react';
import { Quote } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const testimonials = [
  { name: 'Chandrika', role: 'Computer Science Student, ANITS', avatar: 'https://i.pravatar.cc/150?img=1', quote: 'The AI-powered matching makes finding perfect team members incredibly efficient. The platform has everything I need for academic collaboration!' },
  { name: 'Dr. Michael Chen', role: 'Associate Professor, ANITS', avatar: 'https://i.pravatar.cc/150?img=2', quote: "UnitEd's comprehensive platform with real-time chat, analytics, and candidate recommendations has transformed how I manage research teams." },
  { name: 'Ojas Gambheera', role: 'Engineering Student, ANITS', avatar: 'https://i.pravatar.cc/150?img=3', quote: 'From personalized feeds to collaboration hubs, every feature is thoughtfully designed. The email notifications keep me updated on all opportunities!' },
];

const stats = [
  { number: '2000+', label: 'Active Users' },
  { number: '150+', label: 'Faculty Members' },
  { number: '500+', label: 'Projects Completed' },
  { number: '10+', label: 'Core Features' },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 rounded-xl bg-card/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:bg-card hover:shadow-lg">
              <h3 className="text-4xl font-bold text-primary mb-2">{stat.number}</h3>
              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <h2 className="text-4xl font-bold text-center text-foreground mb-4">What Our Users Say</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-[600px] mx-auto text-lg">
          Join thousands of students and faculty who are already collaborating
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-6 rounded-xl bg-card h-full relative transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="absolute top-5 right-5 opacity-10">
                <Quote size={48} className="text-primary" />
              </div>

              <div className="flex items-center mb-5">
                <Avatar className="w-14 h-14 mr-4 border-[3px] border-primary">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-foreground mb-0.5">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;